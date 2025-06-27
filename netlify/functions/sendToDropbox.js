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

    // Lookup client email (creatorEmail) from stored blob
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

    // Upload to Dropbox
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

    // Share file with client email (add as member, notify them)
    const addMemberRes = await fetch('https://api.dropboxapi.com/2/sharing/add_file_member', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: dropboxPath,
        members: [{ '.tag': 'email', email: clientEmail }],
        access_level: { '.tag': 'viewer' },
        add_message_as_comment: false,
        quiet: false // false to send notification email
      })
    });

    if (!addMemberRes.ok) {
      const errText = await addMemberRes.text();
      throw new Error(`Dropbox share failed: ${errText}`);
    }

    // Create a shared link for the file
    const sharedLinkRes = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: dropboxPath,
        settings: {
          requested_visibility: 'public'
        }
      })
    });

    if (!sharedLinkRes.ok) {
      const errText = await sharedLinkRes.text();
      throw new Error(`Dropbox create shared link failed: ${errText}`);
    }

    const sharedLinkData = await sharedLinkRes.json();
    const sharedLinkUrl = sharedLinkData.url.replace('?dl=0', '?dl=1'); // direct download link

    console.log(`✅ ZIP uploaded and shared: ${dropboxPath}`);
    console.log(`📧 Shared link: ${sharedLinkUrl}`);
    console.log(`📧 Email sent to: ${clientEmail} via Dropbox notification`);

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
        clientEmail,
        sharedLinkUrl
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
