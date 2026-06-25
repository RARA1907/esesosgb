# Eses OSGB — SaaS Devralma & Ürünleştirme

> Bu repo, `ovardar/esesosgb` (Orhan Vardar — domain uzmanı) reposundan **fork**'tur.
> Strateji: **Next.js'e ÇEVİRMEK YOK.** Çalışan vanilla HTML sistemini koru, üstüne SaaS kabuğu geç.

## Repo Modeli

```
ovardar/esesosgb (upstream)  ──çek (seçici)──►  RARA1907/esesosgb (production = bu repo)
  Orhan modül geliştirir            sync-upstream.sh        biz SaaS kabuğu + deploy
  kendi Supabase (dev)                                      bizim Supabase Pro (prod)
```

- **upstream** = Orhan'ın repo'su. Tek kaynak (modüller). Dokunmuyoruz, çekiyoruz.
- **origin** = bizim fork. SaaS kabuğunu burada geliştirir, buradan deploy ederiz.
- Çekme: `bash sync-upstream.sh` (sadece modül dosyaları gelir, altyapımız korunur).

## Dosya Sahipliği (çakışmayı önler)

| ORHAN (upstream'den çekilir) | BİZ (asla çekilmez) |
|---|---|
| Modül HTML: risk, workers, training, ppe, periodic, medical, kurul, defter, accidents, near-miss, schedule, dashboard, crm* | `js/navigation.js` (auth/rol) |
| `css/` temalar | `js/supabase-config.js` (DB anahtarı) |
| Operasyon tabloları | `login.html` (auth) |
| Mevzuat / domain mantığı | `saas-admin.html` (tenant yönetimi) |
| | `platform/ billing/ onboarding/ migrations/` (yeni) |
| | deploy config (vercel/CF) |

## Veritabanı
- **Dev:** Orhan'ın Supabase (`dnvuizausfcjzkcsynql`).
- **Prod:** BİZİM Supabase Pro (anahtar bizde) — şema `migrations/` altında versiyonlu.

## SaaS Kabuğu — Yapılacaklar (multi-tenancy'den bağımsız)
- [ ] `?bypass=true` arka kapısını kaldır (`js/navigation.js`)
- [ ] Tüm operasyon şemasını canlı DB'den çıkar → `migrations/` (kod olarak şema)
- [ ] RLS güvenlik denetimi (tek DB'de müşteri izolasyonu)
- [ ] Onboarding: kayıt → tenant + admin otomatik açılır
- [ ] Ödeme/abonelik: iyzico/PayTR → webhook → `tenants.is_active`
- [ ] Paket/limit katmanları (Başlangıç/Pro/Kurumsal)
- [ ] KVKK/VERBİS + veri işleyen sözleşmesi
- [ ] Tanıtım sitesi + custom domain / white-label
- [ ] Deploy pipeline (bizim hesap)

## Marka
- **Ad:** `isgnova` (kilitlendi 2026-06-25). Kimlik kuralları → `BRAND.md`.
- **Logo:** yatay kilit (`brand/logo-horizontal.svg`), kıvılcım favicon (`brand/mark.svg`).
- **Renkler:** Petrol Teal `#0E7C86` · Ink Navy `#0F1D2E` · Hi-Vis Amber `#F4A933`.
- **Domain (şimdilik):** `isgnova.raraprojects.com` alt alan adı (Cloudflare). Sonra kendi domaine (`isgnova.com` müsait) geçilecek.
- [ ] `isgnova.raraprojects.com` deploy (CF Pages + subdomain)
- [ ] Kendi domaini al (sonra) — isgnova.com / .com.tr / .net müsait
- [ ] Raster favicon/PNG seti (build'de `sharp` ile üret)

## Pilot
Soyyılmaz OSGB ile birlikte geliştir → canlı kullanım → hata avı → geniş satış.
