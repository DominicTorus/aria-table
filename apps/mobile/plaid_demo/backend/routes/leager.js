import express from "express";
import axios from "axios";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

// TRANSFER LEDGER WITHDRAW

router.post("/transfer-ledger-withdraw", async (req, res) => {
    const { amount, network, idempotency_key, description } = req.body;
    if ( !amount || !network || !idempotency_key || !description) {
      return res.status(400).json({ error: "Invalid request payload" });
    }
    try {
      const response = await axios.post(
        "https://sandbox.plaid.com/transfer/ledger/withdraw",
        {
          client_id: process.env.PLAID_CLIENT_ID || client_id,
          secret: process.env.PLAID_SECRET || secret,
            amount: amount,
            network: network,
            idempotency_key: idempotency_key,
            description: description
      
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error contacting Plaid API:", error.message);
      res.status(error.response ? error.response.status : 500).json({
        error: error.message,
        ...(error.response ? error.response.data : {}),
      });
    }
})

// TRANSFER LEDGER WITHDRAW SIMULATE

router.post("/transfer-ledger-withdraw-simulate", async (req, res) => {
    const { sweep_id, event_type  } = req.body;
    if ( !sweep_id || !event_type) {
      return res.status(400).json({ error: "Invalid request payload" });
    }
    try {
      const response = await axios.post(
        "https://sandbox.plaid.com/sandbox/transfer/ledger/withdraw/simulate",
        {
          client_id: process.env.PLAID_CLIENT_ID || client_id,
          secret: process.env.PLAID_SECRET || secret,
            sweep_id: sweep_id,
            event_type: event_type
      
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error contacting Plaid API:", error.message);
      res.status(error.response ? error.response.status : 500).json({
        error: error.message,
        ...(error.response ? error.response.data : {}),
      });
    }
})

// TRANSFER LEDGER WITHDRAW SIMULATE AVAILABLE

router.post('/transfer-ledger-withdraw-simulate-available', async (req, res) => {
    const { client_id, secret } = req.body;
    if (!client_id || !secret) {
        return res.status(400).json({ error: 'Invalid request payload: client_id and secret are required.' });
    }
    try {
        const response = await axios.post(
            'https://sandbox.plaid.com/sandbox/transfer/ledger/withdraw/simulate/available',
            {
                client_id: process.env.PLAID_CLIENT_ID || client_id,
                secret: process.env.PLAID_SECRET || secret
            }
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error contacting Plaid API:', error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.message,
            ...(error.response ? error.response.data : {}),
        });
    }
});


export default router;

