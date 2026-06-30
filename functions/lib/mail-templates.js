// İSGNova — Paylaşılan mail şablonları (invite.js + send-invite.js tarafından kullanılır)

const HEADER = `<tr><td style="background:#0F1D2E;padding:24px 32px;text-align:center">
  <img src="https://isgnova.com/brand/assets/favicon-512.png" alt="" width="30" height="30" style="width:30px;height:30px;vertical-align:middle;display:inline-block"> <span style="color:#fff;font-family:'Manrope',Arial,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.5px;vertical-align:middle"><span style="color:#fff">İSG</span><span style="color:#4FD1C5">Nova</span></span>
</td></tr>`;

function button(link) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 22px"><tr><td style="border-radius:10px;background:#0E7C86">
    <a href="${link}" style="display:inline-block;padding:14px 32px;color:#fff;font-weight:700;font-size:15px;text-decoration:none;font-family:'Manrope',Arial,sans-serif">Hesabımı Aktifleştir →</a>
  </td></tr></table>`;
}

function shell(inner) {
  return `<!doctype html><html><body style="margin:0;background:#e9edf1;padding:24px;font-family:'Manrope',Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E2E8F0">
${HEADER}
${inner}
</table></body></html>`;
}

export function adminEmail(link) {
  const inner = `<tr><td style="padding:36px 32px;color:#1E293B;font-size:15px;line-height:1.7">
    <h1 style="margin:0 0 20px;font-size:21px;color:#0F1D2E;font-weight:700">İSGNova OSGB Yönetim Sistemine Hoş Geldiniz</h1>
    <p style="margin:0 0 16px">Merhaba,</p>
    <p style="margin:0 0 16px">Firmamız adına sistemdeki ilk yönetici (Admin) kullanıcısı olarak hesabınız başarıyla tanımlanmıştır. Sistemi kullanmaya başlamadan önce, sistem düzeninin doğru kurulabilmesi için aşağıdaki adımları takip etmeniz gerekmektedir:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;background:#F6F8FA;border-radius:10px;border:1px solid #E2E8F0">
      <tr><td style="padding:16px 18px">
        <p style="margin:0 0 6px;font-weight:700;color:#0E7C86">🔐 Erişim Yetkilerini Yapılandırın</p>
        <p style="margin:0;font-size:14px;color:#475569">İlk girişinizde <b>Erişim Yetkileri</b> sayfasından personellerin rollerini (İSG Uzmanı, İşyeri Hekimi, DSP vb.) ve hangi modülleri görüp işlem yapabileceğini belirleyin. Firmanıza özel yeni roller de ekleyebilirsiniz.</p>
      </td></tr>
      <tr><td style="padding:0 18px 16px">
        <p style="margin:0 0 6px;font-weight:700;color:#0E7C86">🔑 Personel Kartlarını Oluşturun</p>
        <p style="margin:0;font-size:14px;color:#475569">Ardından <b>Personel Yönetimi</b> sayfasından çalışanlarınızı ekleyin, rolleri atayın ve giriş yapabilmeleri için davet e-postası gönderin.</p>
      </td></tr>
    </table>
    <p style="margin:0 0 22px">Hesabınızı aktifleştirmek, daveti kabul etmek ve giriş şifrenizi belirlemek için lütfen aşağıdaki butona tıklayın:</p>
    ${button(link)}
    <p style="margin:0;font-size:13px;color:#94A3B8;border-top:1px solid #E2E8F0;padding-top:16px">* Bu bağlantı size özel ve tek kullanımlıktır. Şifrenizi belirledikten sonra sisteme giriş yapmak için firmanıza ait giriş adresini kullanabilirsiniz.</p>
  </td></tr>
  <tr><td style="padding:20px 32px;background:#F6F8FA;text-align:center;color:#64748B;font-size:13px;border-top:1px solid #E2E8F0">
    İyi çalışmalar dileriz,<br><b style="color:#0F1D2E">İSGNova Software Ekibi</b>
  </td></tr>`;
  return { subject: 'İSGNova OSGB Yönetim Sistemine Hoş Geldiniz', html: shell(inner) };
}

export function staffEmail(link) {
  const inner = `<tr><td style="padding:36px 32px;color:#1E293B;font-size:15px;line-height:1.7">
    <h1 style="margin:0 0 20px;font-size:21px;color:#0F1D2E;font-weight:700">İSGNova OSGB Yönetim Sistemine Davet Edildiniz</h1>
    <p style="margin:0 0 16px">Merhaba,</p>
    <p style="margin:0 0 16px">Firmanız bünyesinde İSGNova OSGB Yönetim platformunu kullanabilmeniz için kullanıcı hesabınız başarıyla oluşturulmuştur.</p>
    <p style="margin:0 0 22px">Sisteme giriş yaparak hesabınızı aktifleştirmek ve şifrenizi belirlemek için aşağıdaki bağlantıya tıklayınız:</p>
    ${button(link)}
  </td></tr>
  <tr><td style="padding:20px 32px;background:#F6F8FA;text-align:center;color:#64748B;font-size:13px;border-top:1px solid #E2E8F0">
    Sağlıklı ve güvenli çalışmalar dileriz,<br><b style="color:#0F1D2E">İSGNova Software Ekibi</b>
  </td></tr>`;
  return { subject: 'İSGNova OSGB Yönetim Sistemine Davet Edildiniz', html: shell(inner) };
}
