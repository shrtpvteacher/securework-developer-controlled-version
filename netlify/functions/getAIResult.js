// netlify/functions/getAIResult.js
const { blobs } = require("@netlify/blobs");

exports.handler = async (event) => {
  const { jobId, taskId } = event.queryStringParameters;

  if (!jobId || taskId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing jobId or taskId" }),
    };
  }

  const blobKey = `${jobId}_${taskId}`;
  const result = await blobs.get("ai-results", blobKey);

  if (!result || !result.body) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "AI result not found" }),
    };
  }

  return {
    statusCode: 200,
    body: result.body,
  };
};
