# OSGB SaaS - Dijital İSG Yönetim Sistemi

Bu proje, Ortak Sağlık Güvenlik Birimleri (OSGB) ve İSG profesyonellerinin (İş Güvenliği Uzmanları, İşyeri Hekimleri, Satış/CRM ekipleri) müşteri portföyünü, yasal süreçlerini, saha operasyonlarını ve CRM/Teklif süreçlerini dijital ortamda uçtan uca yönetebilmesi için geliştirilmiş modern bir **SaaS (Software as a Service) platformu**dur.

---

## 🚀 Teknolojik Altyapı ve Mimari

- **Frontend:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Özelleştirilmiş modern, minimalist **"Ultra Clean"** teması ile).
- **Backend & Database:** **Supabase (PostgreSQL)**. Mock veri yerine doğrudan gerçek Supabase client entegrasyonu kullanılmakta ve RLS (Row Level Security) kuralları uygulanmaktadır.
- **Yapılandırıcı ve Geliştirme Sunucusu:** **Vite** (`npm run dev`).
- **Veri Saklama:** Kalıcı veriler Supabase PostgreSQL tabanında tutulurken; kullanıcı tercihleri ve sayfa bazlı bazı lokal hedefler (ziyaret hedefleri vb.) `localStorage` üzerinde saklanmaktadır.

---

## 🔐 Erişim Kontrolü ve Yetkilendirme

`js/navigation.js` dosyası üzerinden dinamik olarak yönetilen rol bazlı bir erişim denetimi mevcuttur.
- **Roller:** `super_admin`, `admin`, `sales` (Satış), `uzman` (İSG Uzmanı), `hekim` (İşyeri Hekimi), `dsp` (Diğer Sağlık Personeli), `firma_yetkilisi`.
- **Bypass Modu:** Geliştirme/test süreçlerinde URL sonuna `?bypass=true` eklenerek `mockuzman@eses.com` kullanıcısı üzerinden `super_admin` yetkileriyle sisteme doğrudan giriş sağlanabilmektedir.

---

## 📂 Anahtar Modüller ve Sayfa Yapısı

### 1. 🏢 Firma ve Kadro Yönetimi
- **Firma Yönetimi (`index.html`, `company-detail.html`):** Müşteri portföyünün tehlike sınıfı, NACE kodu, çalışan sayıları ve yasal İSG-KATİP aylık gereken uzman/hekim çalışma sürelerinin hesaplanıp izlendiği alan.
- **Kadro Yönetimi (`workers.html`):** Firmadaki çalışanların listelenmesi, işe giriş muayeneleri, periyodik muayeneler ve eğitim durumlarının kişi bazlı izlenmesi.

### 2. 📅 Ziyaret Takibi (`schedule.html`)
- **Planlama ve Takvim:** Saha uzmanları ve hekimlerin aylık ziyaret planlarının takvim ve liste görünümünde yönetilmesi.
- **Hedef & Gerçekleşen İzleme:** Firma bazlı aylık hedef ziyaret sayılarının (localstorage üzerinde) girilmesi ve gerçekleşen ziyaretlerin durum kodlarına göre (Planlandı: Mavi, Gerçekleşti: Yeşil, İptal: Kırmızı) anlık takibi.
- **Süre Kontrolü:** Planlanan ziyaret süreleri ile firmanın yasal yasal uzman/hekim süre hedeflerinin karşılaştırılması.

### 3. 🪧 İSG Kurul Toplantı Motoru (`kurul.html`)
- **Kurul Kontrolü:** Çalışan sayısına göre İSG kurulu kurulması zorunluluğunun yasal denetimi.
- **Gündem ve Üye Yönetimi:** Toplantı gündem maddelerinin oluşturulması, kurul üyelerine davet e-postalarının hazırlanması ve katılım durumları.
- **Kararlar ve DÖF Dönüşümü:** Kurulda alınan kararların doğrudan Düzeltici Önleyici Faaliyet (DÖF) aksiyonlarına dönüştürülerek sisteme kaydedilmesi.

### 4. 📘 Dijital Onaylı Defter (`defter.html`)
- **Tarama Yükleme:** Fiziksel onaylı defter sayfalarının taranarak sisteme arşivlenmesi.
- **Madde Kaydı ve DÖF:** Deftere yazılan maddelerin dijitalleştirilmesi ve aksiyon gerektiren maddelerin doğrudan DÖF sistemine aktarılması.

### 5. 🎓 Eğitim & Sertifikasyon (`training.html`)
- Çalışanların yasal İSG eğitimlerinin planlanması, katılım listelerinin, sınav notlarının girilmesi ve sertifika süreçlerinin takibi.

### 6. 🧤 KKD Zimmet & Takip (`ppe.html`)
- Kişisel Koruyucu Donanımların (KKD) tür bazlı yönetimi, çalışanlara zimmetlenmesi ve zimmet tutanaklarının hazırlanması.

### 7. 🛠️ Periyodik Kontrol (`periodic.html`)
- İş ekipmanlarının (basınçlı kaplar, kaldırma araçları vb.) yasal periyodik kontrol tarihlerinin, muayene raporlarının ve uygunsuzluklarının takibi.

### 8. 📊 CRM ve Satış Hunisi (`crm.html`, `crm-detail.html`, `crm-offer.html`, `crm-reports.html`)
- Müşteri adaylarının kazanım süreçleri, teklif şablonları, sözleşme süreçleri ve satış performans raporları.

### 9. ⚠️ Ramak Kala ve İş Kazaları (`near-miss.html`, `near-miss-admin.html`, `accidents.html`)
- İşyerindeki ramak kala olaylarının bildirimi, onaylanması ve iş kazalarının kök neden analizi yapılarak istatistiksel raporlarının tutulması.

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi lokal bilgisayarınızda çalıştırmak için:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```
2. **Lokal Sunucuyu Başlatın:**
   ```bash
   npm run dev
   ```
3. **Erişim:** Tarayıcıda `http://localhost:5173/` veya `http://localhost:5174/` adresine gidin. Bypass ile hızlı test için URL sonuna `?bypass=true` ekleyin.
