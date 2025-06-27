// src/components/MoonPayCheckout.js
import React, { useState } from "react";

const MOONPAY_API_KEY = process.env.REACT_APP_MOONPAY_API_KEY || process.env.MOONPAY_API_KEY; // adjust based on your env vars

// List of supported fiat currencies (partial for demo, expand as needed)
const FIAT_CURRENCIES = [
  "USD", "EUR", "GBP", "AUD", "CAD", "NZD", "CHF", "JPY", "ZAR",
  "BRL", "MXN", "INR", "SGD", "HKD", "SEK"
];

const MoonPayCheckout = ({ cryptoCurrency = "ETH", onSuccess, onError }) => {
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [fiatAmount, setFiatAmount] = useState("");

  // Open MoonPay hosted checkout popup or redirect
  const handleCheckout = () => {
    if (!fiatAmount || Number(fiatAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const params = new URLSearchParams({
      apiKey: MOONPAY_API_KEY,
      currencyCode: cryptoCurrency,
      baseCurrencyAmount: fiatAmount,
      baseCurrencyCode: fiatCurrency,
      redirectURL: window.location.origin + "/funding-success", // Adjust to your success page
      // Optionally, add 'walletAddress' param if user wallet known
    });
    const url = `https://buy.moonpay.com?${params.toString()}`;

    // Open in new window
    window.open(url, "_blank", "width=500,height=700");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Buy Crypto with MoonPay</h2>

      <label className="block mb-2 font-medium text-gray-700">Fiat Currency</label>
      <select
        value={fiatCurrency}
        onChange={(e) => setFiatCurrency(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {FIAT_CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium text-gray-700">Amount ({fiatCurrency})</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={fiatAmount}
        onChange={(e) => setFiatAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <button
        onClick={handleCheckout}
        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
      >
        Buy {cryptoCurrency}
      </button>
    </div>
  );
};

export default MoonPayCheckout;
