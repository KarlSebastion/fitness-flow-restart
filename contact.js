export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Fitness Flow <info@fitnessflow.co.uk>',
        to: ['info@fitnessflow.co.uk'],
        reply_to: email,
        subject: `New consultation request from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
            <h2 style="color:#1a6b8a;margin-bottom:1.5rem;">New Consultation Request</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:14px;width:120px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:14px;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;"><a href="mailto:${email}" style="color:#2a9d8f;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:14px;">WhatsApp / Phone</td>
                <td style="padding:10px 0;font-size:14px;">${phone || 'Not provided'}</td>
              </tr>
            </table>
            <p style="margin-top:2rem;font-size:13px;color:#aaa;">Sent from fitnessflow.co.uk</p>
          </div>
        `
      })
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
}
