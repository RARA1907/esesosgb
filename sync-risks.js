(function () {
  const RISK_PHOTO_BUCKET = 'risk-photos';

  function getFileExtension(fileType) {
    if (!fileType) return 'jpg';
    if (fileType.includes('png')) return 'png';
    if (fileType.includes('webp')) return 'webp';
    return 'jpg';
  }

  async function uploadRiskPhoto(risk) {
    if (!risk.photo_blob) return null;

    const ext = getFileExtension(risk.photo_type);
    const safeCompanyId = String(risk.company_id || 'unknown-company');
    const path = `${safeCompanyId}/${risk.local_id}.${ext}`;

    const { error } = await window.dbClient.storage
      .from(RISK_PHOTO_BUCKET)
      .upload(path, risk.photo_blob, {
        contentType: risk.photo_type || 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data } = window.dbClient.storage
      .from(RISK_PHOTO_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function syncPendingRisks() {
    if (!navigator.onLine) {
      updateSyncMessage('offline');
      return;
    }

    if (!window.dbClient || !window.OSGBOfflineDB) return;

    const { data: { session } } = await window.dbClient.auth.getSession();
    if (!session) return;

    const pendingRisks = await window.OSGBOfflineDB.getPendingRisks();
    if (!pendingRisks.length) {
      updateSyncMessage('empty');
      if (window.updateOfflineRiskCount) window.updateOfflineRiskCount();
      return;
    }

    for (const risk of pendingRisks) {
      try {
        await window.OSGBOfflineDB.updateRisk(risk.local_id, {
          sync_status: 'syncing',
          last_sync_attempt_at: new Date().toISOString(),
          last_error: null
        });

        const imageUrl = await uploadRiskPhoto(risk);

        const payload = {
          company_id: risk.company_id,
          hazard_title: risk.hazard_title,
          probability_o: risk.probability_o,
          frequency_f: risk.frequency_f,
          severity_s: risk.severity_s,
          risk_score: risk.risk_score,
          target_date: risk.target_date,
          status: 'Açık'
        };

        if (imageUrl) payload.image_url = imageUrl;

        const { data, error } = await window.dbClient
          .from('risk_assessments')
          .insert([payload])
          .select('id')
          .single();

        if (error) throw error;

        await window.OSGBOfflineDB.updateRisk(risk.local_id, {
          sync_status: 'synced',
          server_id: data ? data.id : null,
          synced_at: new Date().toISOString(),
          image_url: imageUrl || null,
          photo_blob: null
        });
      } catch (err) {
        await window.OSGBOfflineDB.updateRisk(risk.local_id, {
          sync_status: 'error',
          last_error: err.message || String(err),
          last_sync_attempt_at: new Date().toISOString()
        });
      }
    }

    if (window.updateOfflineRiskCount) window.updateOfflineRiskCount();
    if (window.fetchRisks) window.fetchRisks();
    updateSyncMessage('done');
  }

  function updateSyncMessage(state) {
    const el = document.getElementById('offline_status');
    if (!el) return;

    if (state === 'offline') {
      el.style.color = '#c2410c';
      el.innerText = 'Çevrimdışı moddasınız. Yeni risk kayıtları cihazda bekleyecek.';
    } else if (state === 'empty') {
      el.style.color = '#16a34a';
      el.innerText = 'Senkron bekleyen risk kaydı yok.';
    } else if (state === 'done') {
      el.style.color = '#16a34a';
      el.innerText = 'Senkronizasyon kontrolü tamamlandı.';
    }
  }

  window.OSGBRiskSync = { syncPendingRisks };
  window.addEventListener('online', syncPendingRisks);
})();
