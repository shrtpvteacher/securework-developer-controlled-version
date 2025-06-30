// netlify/functions/storeEmail.ts

import type { Handler } from '@netlify/functions';
const { blobs } = require('@netlify/blobs');

export const handler: Handler  = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { jobAddress, jobId, creatorEmail, freelancerAddress, creatorAddress, jobTitle } = JSON.parse(event.body || '{}');

    if (!jobAddress || !creatorEmail || !creatorAddress) {
      return { statusCode: 400, body: 'Missing required fields' };
    }

    const blobKey = jobAddress.toLowerCase();
    const payload = {
      jobAddress,
      jobId,
      creatorEmail,
      freelancerAddress,
      creatorAddress,
      jobTitle: jobTitle || "",
      storedAt: new Date().toISOString(),
    };

    await blobs.set("securework-user-emails", blobKey, JSON.stringify(payload));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails stored", payload }),
    };
  } catch (err) {
    console.error("Email store error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
