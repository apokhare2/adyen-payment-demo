require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const ADYEN_API_KEY = process.env.ADYEN_API_KEY;
const ADYEN_MERCHANT_ACCOUNT = process.env.ADYEN_MERCHANT_ACCOUNT;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://adyen-payment-demo.vercel.app";

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

app.post("/api/sessions", async (req, res) => {
  try {
    if (!ADYEN_API_KEY || !ADYEN_MERCHANT_ACCOUNT) {
      return res.status(500).json({
        error: "Missing ADYEN_API_KEY or ADYEN_MERCHANT_ACCOUNT"
      });
    }

    const response = await fetch("https://checkout-test.adyen.com/v71/sessions", {
      method: "POST",
      headers: {
        "X-API-Key": ADYEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: {
          value: 1000,
          currency: "USD"
        },
        countryCode: "US",
        merchantAccount: ADYEN_MERCHANT_ACCOUNT,
        reference: `TEST-${Date.now()}`,
        returnUrl: `${FRONTEND_URL}/`
      })
    });

    const data = await response.json();

    console.log("Adyen response status:", response.status);
    console.log("Adyen response body:", data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json({
      id: data.id,
      sessionData: data.sessionData
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});