interface StoreEmailPayload {
  jobAddress: string;
  email: string;
  title: string;
  creatorAddress: string;
}

export async function storeEmail(payload: StoreEmailPayload): Promise<void> {
  const res = await fetch('/.netlify/functions/storeEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`storeEmail failed: ${errorText}`);
  }
}