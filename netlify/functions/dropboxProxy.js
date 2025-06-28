const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { fileId } = event.queryStringParameters;

  if (!fileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing fileId" }),
    };
  }

  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;

  const response = await fetch("https://api.dropboxapi.com/2/files/get_metadata", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: fileId }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: data.error_summary || "Dropbox API error" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
