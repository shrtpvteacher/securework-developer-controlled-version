// netlify/functions/aiReview.js

const { get, put } = require('@netlify/blobs');
const { Configuration, OpenAIApi } = require('openai');
const aiReviewHelper = require('../../src/helpers/aiReviewHelper');

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { contractAddress, jobId } = body;

  if (!contractAddress || !jobId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing contractAddress or jobId' }),
    };
  }

  try {
    // Fetch job metadata using your helper
    const jobMetadata = await aiReviewHelper.fetchJobMetadata(contractAddress, jobId);

    // Build the OpenAI prompt with your helper
    const prompt = aiReviewHelper.buildReviewPrompt(jobMetadata);

    // Call OpenAI GPT-4.1 for review
    const aiResponse = await openai.createChatCompletion({
      model: 'gpt-4o-mini', // or 'gpt-4o' or your preferred GPT-4.1 model
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical reviewer providing objective and detailed feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const reviewText = aiResponse.data.choices[0].message.content;
    const reviewResult = JSON.parse(reviewText);

    // Save review result as a blob for retrieval in aiVerify
    const blobKey = jobId
      ? `reviews/${contractAddress}--${jobId}.json`
      : `reviews/${contractAddress}.json`;

    await put(blobKey, JSON.stringify(reviewResult), {
      visibility: 'public',
      contentType: 'application/json',
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, reviewResult }),
    };
  } catch (error) {
    console.error('Error in aiReview:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'AI review failed', details: error.message }),
    };
  }
};
