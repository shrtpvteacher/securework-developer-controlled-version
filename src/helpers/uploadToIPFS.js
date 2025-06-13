import axios from 'axios';

export async function uploadToIPFS(data: object) {
  const JWT = process.env.REACT_APP_PINATA_JWT;
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const res = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
  });

  return res.data.IpfsHash;
}
