#!/usr/bin/env bash
# ============================================================
# Orhan'ın ana repo'sundan (upstream) SADECE modül dosyalarını çeker.
# Bizim SaaS altyapı dosyalarımıza DOKUNMAZ.
#
# Kullanım:  bash sync-upstream.sh
# Sonra:     git diff   (incele)  →  git commit  (onayla)
# ============================================================
set -euo pipefail

echo "→ Upstream çekiliyor..."
git fetch upstream

# ------------------------------------------------------------
# ORHAN'IN ALANI — modül dosyaları (upstream'den çekilir)
# Yeni modül eklenince buraya ekle.
# ------------------------------------------------------------
MODULE_FILES=(
  "index.html" "company-detail.html" "workers.html" "schedule.html"
  "risk.html" "medical.html" "actions.html" "accidents.html"
  "near-miss.html" "near-miss-admin.html" "training.html" "training-verify.html"
  "ppe.html" "periodic.html" "defter.html" "kurul.html" "dashboard.html"
  "crm.html" "crm-detail.html" "crm-offer.html" "crm-reports.html"
  "css"
)

# ------------------------------------------------------------
# BİZİM ALANIMIZ — asla upstream'den çekilmez (güvenlik/SaaS):
#   js/navigation.js, js/supabase-config.js, login.html,
#   saas-admin.html (tenant yönetimi bizde olacak),
#   platform/, billing/, onboarding/, migrations/, deploy config
# ------------------------------------------------------------

echo "→ Modül dosyaları upstream/main'den alınıyor..."
for f in "${MODULE_FILES[@]}"; do
  if git cat-file -e "upstream/main:$f" 2>/dev/null; then
    git checkout upstream/main -- "$f"
    echo "   ✓ $f"
  fi
done

echo ""
echo "✅ Çekme bitti. Şimdi:  git diff  ile incele,  git commit  ile onayla."
echo "⚠️  Korunan dosyalar (navigation.js, supabase-config.js, login.html, saas-admin.html) dokunulmadı."
