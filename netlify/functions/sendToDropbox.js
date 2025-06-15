const Busboy = require('busboy');
const fetch = require('node-fetch');
const { blobs } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const busboy = new Busboy({ headers: event.headers });
    const fields = {};
    let fileBuffer = null;
    let filename = '';

    await new Promise((resolve, reject) => {
      busboy.on('file', (fieldname, file, fname) => {
        filename = fname;

        if (!filename.endsWith('.zip')) {
          reject(new Error('Only .zip files are accepted'));
        }

        const chunks = [];
        file.on('data', (data) => chunks.push(data));
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });

      busboy.on('finish', resolve);
      busboy.on('error', reject);
      busboy.end(Buffer.from(event.body, 'base64'));
    });

    const { jobAddress, jobTitle } = fields;

    if (!fileBuffer || !jobAddress || !jobTitle) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields: file, jobAddress, or jobTitle' })
      };
    }

    // 🔍 Lookup client email (creatorEmail) from stored blob
    const blobKey = jobAddress.toLowerCase();
    const stored = await blobs.get('securework-user-emails', blobKey, { type: 'json' });

    if (!stored || !stored.creatorEmail) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No stored email found for this job address' })
      };
    }

    const clientEmail = stored.creatorEmail;

    // 📤 Upload to Dropbox
    const dropboxPath = `/SecureWork/${jobTitle}/${filename}`;
    const uploadRes = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: dropboxPath,
          mode: 'add',
          autorename: true
        })
      },
      body: fileBuffer
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Dropbox upload failed: ${errText}`);
    }

    // 📨 Simulate email notification to client
    console.log(`✅ ZIP uploaded to Dropbox: ${dropboxPath}`);
    console.log(`📧 Email would be sent to: ${clientEmail}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        jobAddress,
        jobTitle,
        file: filename,
        emailSentTo: clientEmail
      })
    };
  } catch (err) {
    console.error('❌ Error in sendToDropbox:', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Server error', details: err.message })
    };
  }
};
