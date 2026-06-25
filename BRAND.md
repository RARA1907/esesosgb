# Marka Kimliği — isgnova

> Türkiye'nin İSG işletim sistemi. OSGB'ler için uçtan uca İSG operasyon platformu.

## Marka Özü
- **Misyon:** OSGB'lerin tüm yasal ve saha operasyonunu tek sistemde toplayıp "sistemde yoksa yapılmamış sayılır" güvenini vermek.
- **Kişilik:** Güvenilir · Net · Modern · Profesyonel
- **Konumlandırma:** OSGB'ler ve kurumsal İSG departmanları için uçtan uca İSG operasyon platformu.
- **Slogan adayları:** "Tüm İSG operasyonu tek panelde." · "Sistemde yoksa, yapılmamıştır."

## Wordmark
- Yazım: her zaman küçük harf **`isgnova`** (tek kelime, bitişik).
- Renk bölünmesi: `isg` Ink Navy + `nova` Petrol Teal (koyu zeminde `isg` beyaz, `nova` açık teal).
- Asla: Title Case, ALL CAPS, araya boşluk/tire.

## Logo
- **Birincil:** `brand/logo-horizontal.svg` (yatay kilit) — header, nav, döküman başlıkları.
- **Koyu zemin:** `brand/logo-horizontal-dark.svg`
- **İşaret (favicon/app):** `brand/mark.svg` — dört uçlu "nova" kıvılcımı.
- **App/PWA ikonu:** `brand/app-icon.svg` (navy yuvarlak tile).
- **Konsept:** "nova" = parlak kıvılcım/atım; bir uç hi-vis amber (iş güvenliği yeleği imzası).
- **Boş alan:** logonun her yanında min. işaret yüksekliği kadar boşluk.
- **Min boyut:** dijitalde 20px yükseklik; işaret 16px favicon'da okunur.
- **YAPMA:** germe, döndürme, gölge/efekt, renk değiştirme, dağınık zemine kontrastsız koyma.

## Renk Paleti
| Rol | İsim | Hex | Kullanım |
|-----|------|-----|----------|
| Birincil | Petrol Teal | `#0E7C86` | Ana butonlar, linkler, marka vurgusu |
| Zemin/Metin | Ink Navy | `#0F1D2E` | Koyu metin, dark mode tabanı, header |
| Aksan | Hi-Vis Amber | `#F4A933` | Logo vurgusu, marka highlight (UI durum rengi DEĞİL) |
| Yüzey | Cloud | `#F6F8FA` | Sayfa/kart yüzeyi |
| Kenar | Mist | `#E2E8F0` | Çizgiler, kenarlıklar |
| Soluk | Slate | `#64748B` | İkincil metin |
| Metin | Ink | `#1E293B` | Ana metin (açık zemin) |
| Koyu teal | Aqua | `#4FD1C5` | Koyu zeminde "nova", linkler |

### Durum Renkleri (uygulama içi — trafik ışığı mantığı)
- Uygun/Tamam: `#16A34A` · Yaklaşan/Uyarı: `#D97706` · Gecikmiş/Hata: `#DC2626` · Bilgi: `#0E7C86`
- **Kritik:** Amber marka aksanı (`#F4A933`) ile uyarı durumu (`#D97706`) ayrı tutulur. Marka amber'i logoda/marketing'de, durum amber'i tablolarda.

### Dark Mode
Taban `#0F1D2E`, yüzey `#16263A`, metin `#E2E8F0`, birincil teal aynı, "nova"/link `#4FD1C5`.

## Tipografi
| Rol | Font | Kullanım |
|-----|------|----------|
| Başlık | Space Grotesk | Hero, bölüm başlıkları, wordmark |
| Gövde/UI | Manrope | Paragraf, buton, etiket |
| Mono | IBM Plex Mono | Yasal süre hesapları, tablolar, sayısal veri |

- Yükleme: Google Fonts. Türkçe karakter desteği tam (ş, ğ, ı, İ, ö, ü, ç).
- Wordmark'ı production'da Space Grotesk 600 + letter-spacing -1 ile render et (veya path'e çevir).

## Marka Sesi
- **Ton:** Net, sade Türkçe; mevzuatı insanlaştıran; güven veren.
- **YAP:** Sade dille anlat · Mevzuatı sadeleştir · Somut fayda göster.
- **YAPMA:** Korku diliyle satma · Aşırı teknik jargon · Abartılı vaat.
- **Örnek başlık:** "Denetim geldiğinde her şey hazır."

## Assetler
| Asset | Yol |
|-------|-----|
| Yatay logo (açık) | brand/logo-horizontal.svg |
| Yatay logo (koyu) | brand/logo-horizontal-dark.svg |
| İşaret / favicon | brand/mark.svg |
| App/PWA ikonu | brand/app-icon.svg |
| Raster favicon seti | brand/assets/ (build sırasında üretilir) |

## Karar Günlüğü
| Tarih | Karar | Gerekçe |
|-------|-------|---------|
| 2026-06-25 | Marka adı: isgnova | .com+.com.tr+.net müsait; İSG kategorisini anlatır, "nova" modern+güven |
| 2026-06-25 | Birincil logo: yatay kilit (A) | Header/nav için ideal; kıvılcım tek başına favicon |
| 2026-06-25 | Palet: petrol teal + ink navy + hi-vis amber | Generic-mavi SaaS'tan kaçar, sektör (hi-vis) imzasını taşır |
