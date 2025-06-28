const { Resend } = require('resend');

// Create a new Resend instance with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  try {
    const { to, subject, html } = JSON.parse(event.body);

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,         // e.g. noreply@freelancepayables.com
      to,                                   // recipient email
      subject,                              // subject line
      html,                                 // email body in HTML
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Unknown error sending email',
      }),
    };
  }
};
