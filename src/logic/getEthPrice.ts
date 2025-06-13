// src/logic/getEthPrice.ts

export async function getEthPrice(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return data.ethereum.usd;
  } catch (err) {
    console.error("Failed to fetch ETH price:", err);
    return null;
  }
}