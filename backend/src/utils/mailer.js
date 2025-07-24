const transporter = require('../config/mailer');

/**
 * Envoie un email générique
 * @param {string} to - Destinataire
 * @param {string} subject - Sujet
 * @param {string} text - Contenu texte
 * @param {string} [html] - Contenu HTML (optionnel)
 */
async function sendMail({ to, subject, text, html }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

/**
 * Envoie le code OTP à l'utilisateur avec un style professionnel
 * @param {string} to - Email du destinataire
 * @param {string} otpCode - Code OTP à envoyer
 */
async function sendOtpMail(to, otpCode) {
  const subject = 'Votre code de vérification (OTP) - QFNexora';
  const text = `Votre code de vérification est : ${otpCode}\nCe code est valable 10 minutes.`;
  const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f8; padding: 40px 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
      <tr>
        <td style="background: #1a237e; padding: 24px 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 2rem; letter-spacing: 2px;">QFNexora</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 32px 16px 32px; color: #222;">
          <h2 style="margin-top: 0; color: #1a237e; font-size: 1.3rem;">Vérification de votre adresse email</h2>
          <p style="font-size: 1rem; color: #444;">Bonjour,</p>
          <p style="font-size: 1rem; color: #444;">Merci de vous être inscrit sur <b>QFNexora</b>.<br>Pour finaliser votre inscription, veuillez saisir le code de vérification ci-dessous&nbsp;:</p>
          <div style="margin: 32px 0; text-align: center;">
            <span style="display: inline-block; background: #e3e7fd; color: #1a237e; font-size: 2.2rem; font-weight: bold; letter-spacing: 8px; padding: 18px 32px; border-radius: 8px; border: 1px solid #c5cae9;">${otpCode}</span>
          </div>
          <p style="font-size: 1rem; color: #444;">Ce code est valable <b>10 minutes</b>.<br>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
        </td>
      </tr>
      <tr>
        <td style="background: #f4f6f8; padding: 24px 32px; text-align: center; color: #888; font-size: 0.95rem; border-top: 1px solid #e0e0e0;">
          &copy; ${new Date().getFullYear()} QFNexora. Tous droits réservés.
        </td>
      </tr>
    </table>
  </div>
  `;
  return sendMail({ to, subject, text, html });
}

module.exports = { sendMail, sendOtpMail }; 