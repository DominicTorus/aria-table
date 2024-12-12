const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

const API_KEY = 'AQExhmfuXNWTK0Qc+iSEnXYttM2VRoRbDIdDV2tF9m6/snJPyfzp6i2KpxSsGTv7qOfv8RDBXVsNvuR83LVYjEgiTGAH-dyG7D8fuV2Sar5qGAedRuC7HU6uUyy5QHzs7xYbZ2pY=-i1id_b{LT6F2;T#S*Ay';
const MERCHANT_ACCOUNT = 'TorusInnovationsPvtLtdECOM';
const PAYMENT_LINK_URL = 'https://checkout-test.adyen.com/v69/paymentLinks';

// BANK PAYMENT
app.post('/api/bank/payment', async (req, res) => {
    try {
        const { bankAccountNumber, bankAccountType, bankLocationId, amount, ownerName } = req.body || {};

        const response = await axios.post('https://checkout-test.adyen.com/v71/payments', {
            "merchantAccount": MERCHANT_ACCOUNT,
            "amount": {
                "currency": "USD",
                "value": amount
            },
            "reference": "ref0001212",
            "paymentMethod": {
                "type": "ach",
                "bankAccountNumber": bankAccountNumber,
                "bankAccountType": bankAccountType,
                "bankLocationId": bankLocationId,
                "ownerName": ownerName
            },
            "billingAddress": {
                "houseNumberOrName": "50",
                "street": "Test Street",
                "city": "Amsterdam",
                "stateOrProvince": "NY",
                "postalCode": "12010",
                "country": "US"
            }
        }, {
            headers: {
                'x-API-key': process.env.ADYEN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Payment request error:', error);
        res.status(error.response?.status || 500).json({
            message: 'An error occurred',
            error: error.message
        });
    }
});

//CREATE PAYMENT LINK 
app.post('/create-payment-link', async (req, res) => {
    const { amount, refID } = req.body;
    try {
        const response = await axios.post(PAYMENT_LINK_URL, {
            amount: {
                currency: 'USD',
                value: amount
            },
            reference: refID,
            returnUrl: 'https://localhost:3000/',
            merchantAccount: MERCHANT_ACCOUNT,
            shopperEmail: 'test@example.com',
            additionalData: {
                allow3DS2: 'true'
            },
            countryCode: 'US',
        }, {
            headers: {
                'x-API-key': process.env.ADYEN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Handle the response
        console.log('Payment Link Created:', response.data['url']);

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating payment session:', error);
        throw error;
    }
});

// VERIFY PAYMENT STATUS
app.post('/api/payment/verify', async (req, res) => {
    const { paymentData } = req.body;
    try {
        const response = await axios.post(`${ADYEN_CHECKOUT_URL}/payments/details`, {
            paymentData: paymentData,
            merchantAccount: MERCHANT_ACCOUNT
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY
            }
        });

        console.log('Payment Status:', response.data);
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating payment session:', error);
        throw error;
    }
});

// CREATE A TRANSFER
app.post('/api/transfer', async (req, res) => {
    try {
        const transferData = {
            amount: req.body.amount,
            balanceAccountId: req.body.balanceAccountId,
            category: req.body.category,
            counterparty: {
                balanceAccountId: req.body.counterparty.balanceAccountId,
                bankAccount: {
                    accountHolder: req.body.counterparty.bankAccount.accountHolder,
                    address: {
                        city: req.body.counterparty.bankAccount.address.city,
                        country: req.body.counterparty.bankAccount.address.country,
                        line1: req.body.counterparty.bankAccount.address.line1,
                        line2: req.body.counterparty.bankAccount.address.line2,
                        postalCode: req.body.counterparty.bankAccount.address.postalCode,
                        stateOrProvince: req.body.counterparty.bankAccount.address.stateOrProvince
                    },
                    dateOfBirth: req.body.counterparty.bankAccount.dateOfBirth,
                    firstName: req.body.counterparty.bankAccount.firstName,
                    fullName: req.body.counterparty.bankAccount.fullName,
                    lastName: req.body.counterparty.bankAccount.lastName,
                    type: req.body.counterparty.bankAccount.type,
                    accountIdentification: {
                        accountNumber: req.body.counterparty.bankAccount.accountIdentification.accountNumber,
                        accountType: req.body.counterparty.bankAccount.accountIdentification.accountType,
                        routingNumber: req.body.counterparty.bankAccount.accountIdentification.routingNumber,
                        type: req.body.counterparty.bankAccount.accountIdentification.type
                    }
                },
                description: req.body.counterparty.description
            }
        };

        const response = await axios.post('https://balanceplatform-api-test.adyen.com/btl/v4/transfers', transferData, {
            headers: {
                'x-API-key': process.env.ADYEN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        print(response.data);

        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


// CREATE A MANDATE PAYMENT
app.post('/create-mandate-payment', async (req, res) => {
    try {
      const paymentData = {
        amount: {
          currency: "INR",
          value: 1000
        },
        countryCode: "IN",
        merchantAccount: MERCHANT_ACCOUNT,
        reference: "ref1234567",
        paymentMethod: {
          type: "scheme",
          encryptedCardNumber: '4111 1111 1111 1111',
          encryptedExpiryYear: '10',
          encryptedExpiryMonth: '25',
          encryptedSecurityCode: '737',
          holderName: 'test'
        },
        mandate: {
          amount: "1000",
          amountRule: "max",
          frequency: "monthly",
          startsAt: "2021-02-16",
          endsAt: "2022-02-16",
          remarks: "Remark on mandate"
        },
        browserInfo: {
          acceptHeader: "*/*",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36"
        },
        shopperEmail: "s.hopper@example.com",
        shopperIP: "127.0.0.1",
        returnUrl: "https://localhost:3000/",
        storePaymentMethod: true,
        shopperInteraction: "Ecommerce",
        recurringProcessingModel: "Subscription",
        shopperReference: "refshop1234"
      };
  
      const response = await axios.post('https://checkout-test.adyen.com/v68/payments', paymentData, {
        headers: {
          'x-api-key': process.env.ADYEN_API_KEY,
          'content-type': 'application/json'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the payment' });
    }
  });

app.get('/', async (req, res) => {
    res.send('Adyen-Torus now listening...');
});

app.listen(3000, () => console.log('Server running on port 3000'));
