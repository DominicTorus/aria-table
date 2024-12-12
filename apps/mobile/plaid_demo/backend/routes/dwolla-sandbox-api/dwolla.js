import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();

// GET PROCESSOR TOKEN
router.post("/get-processor-token", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const {
        account_id,
        processor,
    } = req.body;
    const accessToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!accessToken) {
        return res.status(400).json({ error: "Access token is required in the Authorization header" });
    }
    if (!account_id || !processor) {
        return res.status(400).json({ error: "Invalid request payload" });
    }

    try {
        const response = await axios.post(
            "https://sandbox.plaid.com/processor/token/create",
            {
                client_id: process.env.PLAID_CLIENT_ID,
                secret: process.env.PLAID_SECRET,
                access_token: accessToken,
                account_id: account_id,
                processor: processor
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

// CREATE VERFIED CUSTOMER
router.post("/create-verfied-customer", async (req, res) => {
    const {
        firstName, lastName, email, ipAddress, type, dateOfBirth, ssn,
        address1, city, state, postalCode, businessClassification,
        businessType, businessName, ein
    } = req.body;


    try {
        const accessToken = process.env.ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(500).json({ error: 'Access token is missing from environment variables' });
        }

        const payload = {
            firstName, lastName, email, ipAddress, type, dateOfBirth, ssn,
            address1, city, state, postalCode, businessClassification,
            businessType, businessName, ein
        };

        const response = await axios.post(
            'https://api-sandbox.dwolla.com/customers',
            payload,
            {
                headers: {
                    'Content-Type': 'application/vnd.dwolla.v1.hal+json',
                    Accept: 'application/vnd.dwolla.v1.hal+json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        res.status(response.status).json({ location: response.headers['location'] });
    } catch (error) {
        console.error('Error contacting Dwolla API:', error.message);

        const statusCode = error.response ? error.response.status : 500;
        const errorMessage = error.response && error.response.data ? error.response.data : { error: error.message };

        res.status(statusCode).json(errorMessage);
    }
});

// CREATE UNVERIFIED FUNDING SOURCE
router.post("/create-unverfied-funding-source", async (req, res) => {
    const { routingNumber, accountNumber, bankAccountType, name, customer_id } = req.body;

    try {
        const accessToken = process.env.ACCESS_TOKEN;
        if (!accessToken) {
            return res.status(500).json({ error: 'Access token is missing from environment variables' });
        }

        const payload = {
            routingNumber,
            accountNumber,
            bankAccountType,
            name
        };

        const response = await axios.post(
            `https://api-sandbox.dwolla.com/customers/${customer_id}/funding-sources`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/vnd.dwolla.v1.hal+json',
                    'Accept': 'application/vnd.dwolla.v1.hal+json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        res.status(response.status).json({ location: response.headers['location'] });
    } catch (error) {
        console.error('Error contacting Dwolla API:', error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.message,
            ...(error.response ? error.response.data : {}),
        });
    }
});


//CREATE UNVERIFIED CUSTOMER
router.get("/create-unverified-customers", async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
        const accessToken = process.env.ACCESS_TOKEN;
        if (!accessToken) {
            return res.status(500).json({ error: 'Access token is missing from environment variables' });
        }

        const payload = {
            firstName,
            lastName,
            email
        };

        const response = await axios.post(
            ' https://api-sandbox.dwolla.com/customers',
            payload,
            {
                headers: {
                    'Content-Type': 'application/vnd.dwolla.v1.hal+json',
                    'Accept': 'application/vnd.dwolla.v1.hal+json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

        );

        res.status(response.status).json(response.headers['location']);
    } catch (error) {
        console.error('Error contacting Dwolla API:', error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.message,
            ...(error.response ? error.response.data : {}),
        });
    }
});


//CREATE VERIFIED FUNDING SOURCES USING PLAID PROCESSOR TOKEN
router.post("/verified-funding-source", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { name } = req.body;
    const plaid_token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!plaid_token) {
        return res.status(400).json({ error: "Access token is required in the Authorization header" });
    }
    try {
        const accessToken = process.env.ACCESS_TOKEN;
        if (!accessToken) {

            return res.status(500).json({ error: 'Access token is missing from environment variables' });
        }

        const payload = {
            name,
            plaid_token: plaid_token
        };

        const response = await axios.post(
            `https://api-sandbox.dwolla.com/customers/${req.params.customer_id}/funding-sources`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/vnd.dwolla.v1.hal+json',
                    'Accept': 'application/vnd.dwolla.v1.hal+json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        res.status(response.status).json(response.headers['location']);
    } catch (error) {
        console.error('Error contacting Dwolla API:', error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.message,
            ...(error.response ? error.response.data : {}),
        });
    }

});


// CREATE TRANSFER
router.post("/create-transfer", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { source, destination, currency, value } = req.body;

    try {
        const accessToken = process.env.ACCESS_TOKEN;
        if (!accessToken) {

            return res.status(500).json({ error: 'Access token is missing from environment variables' });
        }

        const payload = {
            "_links": {
                "source": {
                    "href": source
                },
                "destination": {
                    "href": destination
                }
            },
            "amount": { "currency": currency, "value": value},
        };

        const response = await axios.post(
            `https://api-sandbox.dwolla.com/transfers`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/vnd.dwolla.v1.hal+json',
                    'Accept': 'application/vnd.dwolla.v1.hal+json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        res.status(response.status).json(response.headers['location']);
    } catch (error) {
        console.error('Error contacting Dwolla API:', error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.message,
            ...(error.response ? error.response.data : {}),
        });
    }

});

export default router;
