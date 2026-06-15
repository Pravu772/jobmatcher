const { Resend } = require('resend');

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a branded, styled password reset email using the Resend SDK.
 * @param {string} email - Recipient email address
 * @param {string} resetLink - The password reset URL
 * @returns {Promise<any>}
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  const { data, error } = await resend.emails.send({
    from: 'JobMatcher AI <noreply@jobmatcherai.app>',
    to: email,
    subject: 'Reset Your JobMatcher AI Password',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563EB,#1D4ED8);padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="font-size:1.5rem;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">JobMatcher AI</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:1.4rem;font-weight:700;color:#111827;">Password Reset Request</h1>
              <p style="margin:0 0 24px;font-size:0.95rem;color:#6B7280;line-height:1.6;">
                We received a request to reset your password for your <strong>JobMatcher AI</strong> account. Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:14px 36px;background:#2563EB;color:#ffffff;font-size:1rem;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.2px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <p style="margin:0 0 24px;font-size:0.85rem;color:#6B7280;text-align:center;">
                ⏱ This link expires in <strong>15 minutes</strong>.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 24px;" />

              <!-- Fallback link -->
              <p style="margin:0;font-size:0.82rem;color:#9CA3AF;line-height:1.6;">
                If the button above doesn't work, copy and paste the link below into your browser:
              </p>
              <p style="margin:8px 0 0;font-size:0.8rem;word-break:break-all;">
                <a href="${resetLink}" style="color:#2563EB;text-decoration:underline;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:0.8rem;color:#9CA3AF;line-height:1.6;">
                🔒 If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.<br />
                This email was sent to <strong>${email}</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:0.78rem;color:#9CA3AF;">
                © ${new Date().getFullYear()} JobMatcher AI · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });

  if (error) {
    console.error('❌ Resend API Error:', error);
    throw new Error(error.message || 'Error sending password reset email');
  }

  return data;
};

module.exports = {
  sendPasswordResetEmail,
};
