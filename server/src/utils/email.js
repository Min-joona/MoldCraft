const nodemailer = require('nodemailer');

// In dev with no email config, just log to console instead of crashing
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null; // will be handled below
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    // Dev mode: just print to terminal instead of sending
    console.log('\n📧 [DEV - Email not sent, logged instead]');
    console.log('   To     :', to);
    console.log('   Subject:', subject);
    console.log('   (Configure EMAIL_USER and EMAIL_PASS in .env to send real emails)\n');
    return;
  }
  return transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

const quoteConfirmationEmail = (quote) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body{font-family:Arial,sans-serif;color:#333;background:#f5f5f5}
  .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden}
  .header{background:#0f172a;color:#fff;padding:32px;text-align:center}
  .header h1{margin:0;font-size:24px;letter-spacing:2px}
  .accent{color:#f97316}
  .body{padding:32px}
  .quote-num{background:#f97316;color:#fff;display:inline-block;padding:8px 16px;border-radius:4px;font-weight:bold;font-size:18px;margin-bottom:20px}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee}
  .footer{background:#f5f5f5;padding:20px 32px;text-align:center;font-size:13px;color:#888}
</style></head><body>
  <div class="container">
    <div class="header"><h1>MOLD<span class="accent">CRAFT</span></h1><p style="margin:8px 0 0;opacity:.7">Quote Request Received</p></div>
    <div class="body">
      <p>Hi <strong>${quote.name}</strong>,</p>
      <p>Thank you! We received your quote request and will respond within <strong>1–2 business days</strong>.</p>
      <div class="quote-num">${quote.quoteNumber}</div>
      <p>Your reference number — keep it for tracking.</p>
      <div class="row"><span style="color:#888">Part</span><span>${quote.partDescription}</span></div>
      <div class="row"><span style="color:#888">Material</span><span>${quote.material}</span></div>
      <div class="row"><span style="color:#888">Quantity</span><span>${quote.quantity} units</span></div>
      <p style="margin-top:24px">Questions? Reply to this email anytime.</p>
    </div>
    <div class="footer"><p>MoldCraft · Custom Plastic Injection Molding</p></div>
  </div>
</body></html>`;

const adminQuoteNotificationEmail = (quote) => `
<h2>New Quote — ${quote.quoteNumber}</h2>
<p><b>From:</b> ${quote.name} (${quote.email})</p>
<p><b>Phone:</b> ${quote.phone || 'Not provided'}</p>
<p><b>Company:</b> ${quote.company || 'Individual'}</p>
<hr>
<p><b>Part:</b> ${quote.partDescription}</p>
<p><b>Material:</b> ${quote.material}</p>
<p><b>Quantity:</b> ${quote.quantity}</p>
<p><b>Color:</b> ${quote.color || 'Not specified'}</p>
${quote.additionalNotes ? `<p><b>Notes:</b> ${quote.additionalNotes}</p>` : ''}`;

module.exports = { sendEmail, quoteConfirmationEmail, adminQuoteNotificationEmail };
