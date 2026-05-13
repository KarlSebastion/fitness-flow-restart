exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, phone } = JSON.parse(event.body || '{}');

  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and email are required.' })
    };
  }

  const res = await fetch('https://api.resend.com/emails', {
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
          <p style="margin-top:2rem;font-size:13px;color:#aaa;">Sent from fitnessflow.co.uk/cyprus</p>
        </div>
      `
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email.' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
