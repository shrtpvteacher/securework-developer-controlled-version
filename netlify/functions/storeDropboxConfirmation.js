// netlify/functions/storeDropboxConfirmation.js
const { blobs } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { jobId, taskId, dropboxFileId } = JSON.parse(event.body);
    if (!jobId || !taskId || !dropboxFileId) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const blobKey = `${jobId}_${taskId}`;
    await blobs.set("dropbox-confirmations", blobKey, JSON.stringify({ jobId, taskId, dropboxFileId }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Dropbox confirmation stored" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};