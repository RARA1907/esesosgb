// İSGNova — Doğrudan davet endpoint'i (saas-admin paneli için)
// Auth: Authorization: Bearer <supabase_jwt> (super_admin olmalı)
// Body: { staff_id, redirect_to? }

import { adminEmail, staffEmail } from '../lib/mail-templates.js';

const DEFAULT_REDIRECT = 'https://isgnova.com/login';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const SUPABASE_URL = env.SUPABASE_URL;
  const SR = env.SUPABASE_SERVICE_ROLE;
  const sbAdmin = {
    apikey: SR,
    Authorization: `Bearer ${SR}`,
    'Content-Type': 'application/json',
  };

  // 1) JWT doğrulama — çağıran super_admin mı?
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'unauthorized' }, 401);

  const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SR, Authorization: `Bearer ${token}` },
  });
  if (!userResp.ok) return json({ error: 'unauthorized' }, 401);
  const user = await userResp.json().catch(() => ({}));

  const staffCheckResp = await fetch(
    `${SUPABASE_URL}/rest/v1/osgb_staff?select=access_role&email=ilike.${encodeURIComponent(user.email)}&limit=1`,
    { headers: sbAdmin }
  );
  const staffCheck = await staffCheckResp.json().catch(() => []);
  const callerRole = (staffCheck[0]?.access_role || '').toLowerCase();
  if (callerRole !== 'super_admin') return json({ error: 'forbidden' }, 403);

  // 2) Body'den staff_id al
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
  const { staff_id, redirect_to } = body || {};
  if (!staff_id) return json({ error: 'staff_id required' }, 400);

  // 3) Staff kaydını çek
  const staffResp = await fetch(
    `${SUPABASE_URL}/rest/v1/osgb_staff?id=eq.${staff_id}&select=*&limit=1`,
    { headers: sbAdmin }
  );
  const staffData = await staffResp.json().catch(() => []);
  const record = staffData[0];
  if (!record) return json({ error: 'staff not found' }, 404);

  const email = (record.email || '').trim();
  if (!email) return json({ error: 'no email on staff record' }, 400);

  // 4) Aktivasyon linki üret
  const finalRedirect = redirect_to || DEFAULT_REDIRECT;

  async function genLink(linkType) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: sbAdmin,
      body: JSON.stringify({ type: linkType, email, redirect_to: finalRedirect }),
    });
    const d = await r.json().catch(() => ({}));
    const link = d.action_link || (d.properties && d.properties.action_link) || null;
    return { ok: r.ok && !!link, link, detail: d };
  }

  let res = await genLink('invite');
  if (!res.ok) res = await genLink('recovery');
  if (!res.ok) return json({ error: 'generate_link failed', detail: res.detail }, 500);

  // 5) Şablon seç ve gönder
  const role = (record.access_role || '').toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const mail = isAdmin ? adminEmail(res.link) : staffEmail(res.link);

  const sendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'İSGNova <noreply@send.isgnova.com>',
      to: [email],
      subject: mail.subject,
      html: mail.html,
    }),
  });
  const sendData = await sendResp.json().catch(() => ({}));
  if (!sendResp.ok) return json({ error: 'resend failed', detail: sendData }, 502);

  // 6) Status güncelle
  await fetch(`${SUPABASE_URL}/rest/v1/osgb_staff?id=eq.${staff_id}`, {
    method: 'PATCH',
    headers: { ...sbAdmin, Prefer: 'return=minimal' },
    body: JSON.stringify({
      auth_invite_status: 'sent',
      auth_invited_at: new Date().toISOString(),
    }),
  });

  return json({ ok: true, email, template: isAdmin ? 'admin' : 'staff', resend_id: sendData.id });
}
