import express from "express";
import axios from "axios";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

  // GET TRANSACTIONS
  router.post("/api/transactions", async (req, res) => {
    const { client_id, secret, access_token, start_date, end_date,options } = req.body;
    if (!access_token) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transactions/get",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            access_token,
            start_date,
            end_date,
            options
          }
        );
        res.status(response.status).json(response.data);
      } catch (error) {
        console.error("Error contacting plaid API:", error.message);
        res.status(error.response ? error.response.status : 500).json({
          error: error.message,
          ...(error.response ? error.response.data : {}),
        });
      }
    }
  });
  
  // SYNC TRANSACTIONS
  router.post("/api/sync/transactions", async (req, res) => {
    const { client_id, secret, access_token, count} = req.body;
    if (!access_token) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transactions/sync",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            access_token,
            count
          }
        );
        res.status(response.status).json(response.data);
      } catch (error) {
        console.error("Error contacting plaid API:", error.message);
        res.status(error.response ? error.response.status : 500).json({
          error: error.message,
          ...(error.response ? error.response.data : {}),
        });
      }
    }
  });

  
  export default router;