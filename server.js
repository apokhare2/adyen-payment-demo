require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const ADYEN_API_KEY = process.env.ADYEN_API_KEY;
const ADYEN_MERCHANT_ACCOUNT = process.env.ADYEN_MERCHANT_ACCOUNT;

app.post("/api/sessions", async (req, res) => {
  try {
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
        returnUrl: "http://localhost:3000/"
      })
    });

    const data = await response.json();
    console.log("Adyen response status:", response.status);
    console.log("Adyen response body:", data);

    res.status(response.status).json({
      id: data.id,
      sessionData: data.sessionData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});