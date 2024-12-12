import express from "express";
import axios from "axios";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

// RETRIEVE ITEM ACCOUNT LIST
router.post("/get-item-account-info", async (req, res) => {
    const { access_token } =
      req.body;
    if (!access_token) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/accounts/get",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            access_token: access_token,
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
  
  
  // AUTHORIZE A TRANSFER
  router.post("/authorize", async (req, res) => {
    const { access_token, account_id, type, network, ach_class, amount, user } =
      req.body;
    if (!access_token || !account_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/authorization/create",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            access_token: access_token,
            account_id: account_id,
            type: type,
            network: network,
            ach_class: ach_class,
            amount: amount,
            user: user,
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
  

  // INITIATE A TRANSFER
  router.post("/initiate", async (req, res) => {
    const {
      access_token,
      account_id,
      type,
      network,
      ach_class,
      amount,
      user,
      description,
      origination_account_id,
      custom_tag,
      iso_currency_code,
      metadata,
      authorization_id,
    } = req.body;
    if (!access_token || !account_id || !type || !network || !ach_class || !amount  || !iso_currency_code || !authorization_id || !user || !description || !origination_account_id ||  !metadata) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/create",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            access_token: access_token,
            account_id: account_id,
            type: type,
            network: network,
            ach_class: ach_class,
            amount: amount,
            iso_currency_code: iso_currency_code,
            description: description,
            user: user,
            // custom_tag: custom_tag,
            metadata: metadata,
            origination_account_id: origination_account_id,
            authorization_id: authorization_id
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

  // TRANSFER INTENT CREATE
  router.post("/transfer-intent-create", async (req, res) => {
    const {
      account_id,
      mode,
      ach_class,
      amount,
      user,
      description,
      origination_account_id,
      
    } = req.body;
    if ( !account_id || !mode || !ach_class || !amount || !user || !description || !origination_account_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/intent/create",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            account_id: account_id,
            mode: mode,
            amount: amount,
            description: description,
            ach_class: ach_class,
            origination_account_id: origination_account_id,
            user: user
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

  // LIST TRANSFER EVENTS
  router.post("/list-transfer-events", async (req, res) => {
    const {
      start_date,
      end_date,
      event_types,
      transfer_id,
      origination_account_id,
      direction,
    } = req.body;
    if (!start_date || !end_date || !event_types || !transfer_id || !origination_account_id || !direction) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/event/list",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            start_date: start_date,
            end_date: end_date,
            transfer_id: transfer_id,
            account_id: account_id,
            transfer_type: transfer_type,
            event_types: event_types,
            count: 25,
            offset: 0,
            origination_account_id: origination_account_id,
            direction: direction
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

  // TRANSFER EVENT SYNC
  router.post("/transfer-event-sync", async (req, res) => {
    const {
      after_id
    } = req.body;
    if ( !after_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/event/sync",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            after_id: after_id,
            count: 25
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

  //EVENT SIMULATE A TRANFER
  router.post("/event-simulate", async (req, res) => {
    const { transfer_id, event_type } = req.body;
    if (!transfer_id || !event_type) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/sandbox/transfer/simulate",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            transfer_id: transfer_id,
            event_type: event_type
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

  // TRANSFER INTENT GET
  router.post("/get-transfer-id", async (req, res) => {
    const { transfer_intent_id } = req.body;
    if (!transfer_intent_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/intent/get",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            transfer_intent_id: transfer_intent_id
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

  // TRANSFER GET
  router.post("/transfer-get", async (req, res) => {
    const { transfer_id } = req.body;
    if (!transfer_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/get",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            transfer_id: transfer_id
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

  // TRANSFER LIST
  router.post("/transfer-list", async (req, res) => {
    const { start_date, end_date , count, offset, origination_account_id   } = req.body;
    if (!start_date || !end_date || !count || !offset || !origination_account_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/list",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            start_date: start_date, 
            end_date: end_date, 
            count: count,
            offset: offset,
            origination_account_id: origination_account_id
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

  // TRANSFER CANCEL
  router.post("/transfer-cancel", async (req, res) => {
    const { transfer_id } = req.body;
    if (!transfer_id) {
      return res.statusCode(400).json({ error: "Invalid request payload" });
    } else {
      try {
        const response = await axios.post(
          "https://sandbox.plaid.com/transfer/cancel",
          {
            client_id: process.env.PLAID_CLIENT_ID || client_id,
            secret: process.env.PLAID_SECRET || secret,
            transfer_id: transfer_id
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