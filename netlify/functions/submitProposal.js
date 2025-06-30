// netlify/functions/submitProposal.js
const { Resend } = require('resend');

exports.handler = async (event) => {
  try {
    const { jobAddress, proposal, freelancerAddress, email } = JSON.parse(event.body);

    // Send to your admin or the client; change this as needed
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'no-reply@yourdomain.com',
      to: 'client@email.com', // TODO: look up the real client email from your job metadata if needed
      subject: `New Proposal for Job ${jobAddress}`,
      html: `
        <h2>New Proposal Submitted</h2>
        <p><strong>Job Address:</strong> ${jobAddress}</p>
        <p><strong>Freelancer:</strong> ${freelancerAddress}</p>
        <p><strong>Freelancer Email:</strong> ${email}</p>
        <p><strong>Proposal:</strong><br/>${proposal}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
