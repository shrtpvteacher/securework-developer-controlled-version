/* netlify/functions/aiVerify.js */
const { ethers } = require('ethers');
const { get }    = require('@netlify/blobs');
const fetch       = require('node-fetch');          // for Resend API

exports.handler = async (event) => {
  /* ── CORS & method guard ────────────────────────────────────────── */
  if (event.httpMethod === 'OPTIONS')
    return ok('');
  if (event.httpMethod !== 'POST')
    return error(405, 'Method not allowed');

  /* ── Parse request body ─────────────────────────────────────────── */
  let body;
  try { body = JSON.parse(event.body); }
  catch { return error(400, 'Invalid JSON'); }

  const {
    contractAddress,
    dropboxFileId,      // opaque string stored on-chain
    dropboxLink,        // full share link emailed to client
    clientEmail,        // email recipient
    jobId,              // optional, if your contract is multi-job
  } = body;

  if (!contractAddress || !dropboxFileId || !dropboxLink || !clientEmail)
    return error(400, 'Missing required fields');

  /* ── Retrieve stored AI verdict ─────────────────────────────────── */
  const blobKey = jobId !== undefined
    ? `reviews/${contractAddress}--${jobId}.json`
    : `reviews/${contractAddress}.json`;

  let verdict;
  try {
    const blob = await get(blobKey);
    verdict    = JSON.parse(await blob.text());
  } catch {
    return error(400, 'AI review blob not found — run aiReview first');
  }

  if (!verdict.passed)
    return error(400, 'AI review did not pass; verification aborted');

  /* ── Send email with full Dropbox link (Resend API) ─────────────── */
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        Authorization  : `Bearer ${process.env.RESEND_API_KEY}`, // ← set in Netlify
      },
      body: JSON.stringify({
        from   : process.env.FROM_EMAIL, // e.g., no-reply@yourapp.com
        to     : clientEmail,
        subject: 'Your freelancer has submitted work for review',
        html   : `
<p>Hello,</p>
<p>Your freelancer has submitted their final work. You can download it here:</p>
<p><a href="${dropboxLink}">${dropboxLink}</a></p>
<p>This link is NOT stored on-chain and is only visible to you.</p>
<p>— SecureWork AI Verifier</p>`,
      }),
    });

    if (!emailRes.ok) {
      console.error('Email send failed:', await emailRes.text());
      // We’ll continue; contract call still happens
    }
  } catch (e) {
    console.error('Resend email error:', e);
  }

  /* ── Call verifyByAI on-chain (store only dropboxFileId) ─────────── */
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
    const signer   = new ethers.Wallet(process.env.AI_VERIFIER_PRIVATE_KEY, provider);

    const jobEscrowAbi = ['function verifyByAI(string fileId) external'];
    const jobContract  = new ethers.Contract(contractAddress, jobEscrowAbi, signer);

    const tx = await jobContract.verifyByAI(dropboxFileId);
    await tx.wait();

    return ok({ success: true, txHash: tx.hash });
  } catch (e) {
    console.error('verifyByAI error:', e);
    return error(500, e.message);
  }
};

/* ── Helpers ──────────────────────────────────────────────────────── */
const corsHeaders = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type'               : 'application/json',
};
const ok    = (body) => ({ statusCode: 200, headers: corsHeaders, body: JSON.stringify(body) });
const error = (code, msg) => ({ statusCode: code, headers: corsHeaders, body: JSON.stringify({ error: msg }) });
