// netlify/functions/storeAIResult.js
const { blobs } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

 try {
    const { jobId, deliverables, aiPassed, itemBreakdown, summary } = JSON.parse(event.body);

    if (!jobId || !taskId || typeof aiPassed !== "boolean" || !Array.isArray(itemBreakdown)) {
      return { statusCode: 400, body: "Missing or invalid fields" };
    }

    const blobKey = `${jobId}_${taskId}`;
    const payload = {
      jobId,
      deliverables,
      aiPassed,
      summary: summary || "",
      itemBreakdown,
      storedAt: new Date().toISOString(),
    };

    await blobs.set("ai-results", blobKey, JSON.stringify(payload));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Detailed AI result stored", payload }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};



