import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.cjs";
import open from "open";
import dotenv from "dotenv";
import cors from "cors";
import balanceRouter from "./routes/balance.js";
import dwollaRouter from "./routes/dwolla-sandbox-api/dwolla.js";
import leagerRouter from "./routes/leager.js";
import transferRouter from "./routes/transfer.js";
import transactionRouter from "./routes/transaction.js";


dotenv.config();

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());
app.use("/balance", balanceRouter);
app.use("/api/dwolla", dwollaRouter);  
app.use("/leager", leagerRouter);
app.use("/transfer", transferRouter);
app.use("/transaction", transactionRouter);


// CREATE LINK TOKEN
app.post("/api/create-link-token", async (req, res) => {
  const {
    client_name,
    country_codes,
    language,
    user,
    products,
  } = req.body;

  if (!client_name || !country_codes || !language || !user || !products) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/link/token/create",
      {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        client_name,
        country_codes,
        language,
        user,
        products,
        webhook: "https://www.genericwebhookurl.com/webhook",
        android_package_name: "com.example.frontend",
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
});

// CREATE PUBLIC TOKEN
app.post("/api/create-public-token", async (req, res) => {
  const { institution_id, initial_products } = req.body;

  if (!institution_id || !initial_products) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/sandbox/public_token/create",
      {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        institution_id,
        initial_products,
        options: {
          webhook: "https://www.genericwebhookurl.com/webhook",
        },
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
});

// EXCHANGE PUBLIC TOKEN
app.post("/api/exchange-public-token", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const publicToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!publicToken) {
    return res.status(400).json({ error: "Public token is required in the Authorization header" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/item/public_token/exchange",
      {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        public_token: publicToken,
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
});
// GET AUTH DETAILS
app.post("/api/auth", async (req, res) => {
  const authHeader = req.headers['authorization']; 
  const accessToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required in the Authorization header" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/auth/get",
      {
        client_id: process.env.PLAID_CLIENT_ID || client_id,
        secret: process.env.PLAID_SECRET || secret,
        access_token: accessToken,
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
});

// GET IDENTITY DETAILS
app.post("/api/identity/get", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required in the Authorization header" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/identity/get",
      {
        client_id: process.env.PLAID_CLIENT_ID || client_id,
        secret: process.env.PLAID_SECRET || secret,
        access_token: accessToken, 
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
});

// GET ACCOUNT CAPABILITIES
app.post("/api/get-capabilities", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required in the Authorization header" });
  }
const { account_id } = req.body;

  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/transfer/capabilities/get",
      {
        client_id: process.env.PLAID_CLIENT_ID || client_id,
        secret: process.env.PLAID_SECRET || secret,
        access_token: accessToken, 
        account_id: account_id
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
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs.specs));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  open(`http://localhost:${port}/api-docs`);
});
