const { Resend } = require('resend');

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email using the Resend SDK.
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
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password.</p>
      <a href="${resetLink}">
        Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
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
