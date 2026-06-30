// İSGNova — Davet/Hoşgeldin maili gönderen CF Pages Function
// Tetikleyici: Supabase DB Webhook (osgb_staff INSERT) → bu endpoint
// Akış: güvenli aktivasyon linki üret (Supabase) → markalı mail gönder (Resend) → auth_invite_status='sent'
//
// Gerekli env (CF Pages → Settings → Environment variables):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE, RESEND_API_KEY, WEBHOOK_SECRET, MAIL_FROM

import { adminEmail, staffEmail } from '../lib/mail-templates.js';

const REDIRECT_TO = 'https://isgnova.com/login';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1) Güvenlik — sadece bizim webhook'umuz tetikleyebilsin
  const secret = request.headers.get('x-webhook-secret');
  if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
    return json({ error: 'unauthorized' }, 401);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'bad json' }, 400);
  }

  const { type, table, record } = payload || {};
  if (type !== 'INSERT' || table !== 'osgb_staff' || !record) {
    return json({ skipped: true, reason: 'not an osgb_staff insert' });
  }

  const email = (record.email || '').trim();
  const status = record.auth_invite_status || 'not_sent';
  const canLogin = record.can_login !== false;
  if (!email || status !== 'not_sent' || !canLogin) {
    return json({ skipped: true, reason: 'no email / already invited / login disabled' });
  }

  const SUPABASE_URL = env.SUPABASE_URL;
  const SR = env.SUPABASE_SERVICE_ROLE;
  const sbHeaders = {
    apikey: SR,
    Authorization: `Bearer ${SR}`,
    'Content-Type': 'application/json',
  };

  // 2) Güvenli aktivasyon linki üret (önce invite; kullanıcı zaten varsa recovery'ye düş)
  async function genLink(linkType) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify({ type: linkType, email, redirect_to: REDIRECT_TO }),
    });
    const d = await r.json().catch(() => ({}));
    const link = d.action_link || (d.properties && d.properties.action_link) || null;
    return { ok: r.ok && !!link, link, detail: d };
  }

  let res = await genLink('invite');
  if (!res.ok) res = await genLink('recovery'); // kullanıcı zaten kayıtlıysa
  if (!res.ok) {
    return json({ error: 'generate_link failed', detail: res.detail }, 500);
  }
  const actionLink = res.link;

  // 3) Şablon seç (ilk admin mi, personel mi)
  const role = (record.access_role || '').toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const mail = isAdmin ? adminEmail(actionLink) : staffEmail(actionLink);

  // 4) Resend ile gönder
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
  if (!sendResp.ok) {
    return json({ error: 'resend failed', detail: sendData }, 502);
  }

  // 5) Durumu güncelle
  await fetch(`${SUPABASE_URL}/rest/v1/osgb_staff?email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, Prefer: 'return=minimal' },
    body: JSON.stringify({
      auth_invite_status: 'sent',
      auth_invited_at: new Date().toISOString(),
    }),
  });

  return json({ ok: true, email, template: isAdmin ? 'admin' : 'staff', resend_id: sendData.id });
}
