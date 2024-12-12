const express = require('express');
const stripe = require('stripe')('sk_test_51Ps0JiP2TaXjU555MmyEWnSKYbcrpGjb3a5YT0Q70Q3CF2EQdMvb8yNF3qSqcb18OctmX4oUfDjIcvLYk7Mbwr6B00NO7exf03'); // Replace with your Stripe secret key
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CREATE A CUSTOMER
app.post('/create-customer', async (req, res) => {
  const { email } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: email,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE A PRODUCT
app.post('/create-product', async (req, res) => {
  const { productName } = req.body;

  try {
    const product = await stripe.products.create({
      name: productName,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

 // CREATE A PRICE FOR THE PRODUCT
app.post('/create-price', async (req, res) => {
  const { unit_amount, product_id } = req.body;

  try {
    const price = await stripe.prices.create({
      unit_amount: unit_amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      product: product_id,
    });

    res.status(201).json(price);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// MERCHANT ONBOARDING ZONE

//CREATE A CONNECTED ACCOUNT (CUSTOM)
app.post('/custom_onboard', async (req, res) => {
  const { country, type, business_profile_url, date, ip_address } = req.body;

  try {
    const account = await stripe.accounts.create({
      country: country,
      business_type: 'company',
      type: 'custom',
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    // const updateAccount = await stripe.accounts.update(
    //   'acct_1PuxDhP4wZiKABdB',
    //   {
    //     business_profile: {
    //       url: business_profile_url,
    //     },
    //     tos_acceptance: {
    //       date: date,
    //       ip: ip_address,
    //     },
    //   }
    // );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// CREATE A ACCOUNT
// app.post('/create_account', async (req, res) => {
//   const {
//     country,
//     type,
//     business_profile_url,
//     date,
//     ip_address,
//     address,
//     name,
//     export_license_id,
//     export_purpose_code,
//     owners_provided,
//     phone,
//     registration_number,
//     employer_id,
//     vat_id,
//     dob,
//     first_name,
//     last_name,
//     gender,
//     id_number,
//     id_number_secondary,
//     political_exposure,
//     city,
//     address_line1,
//     address_line2,
//     postal_code,
//     state,
//     relationship_title,
//     ssn_last_4,
//     selected_capabilities
//   } = req.body;

//   try {
//     const accountParams = {
//       country: country,
//       type: 'custom',
//       capabilities: selected_capabilities.reduce((acc, capability) => {
//         acc[capability] = { requested: true };
//         return acc;
//       }, {}),
//       tos_acceptance: {
//         date: Math.floor(new Date(date).getTime() / 1000),
//         ip: ip_address
//       }
//     };

//     if (type === 'company') {
//       accountParams.business_profile = {
//         name: name,
//         product_description: address,
//         url: business_profile_url
//       };
//       accountParams.business = {
//         address: {
//           line1: address_line1,
//           line2: address_line2,
//           city: city,
//           state: state,
//           postal_code: postal_code,
//           country: country
//         },
//         name: name,
//         tax_id: registration_number,
//         vat_id: vat_id
//       };
//     } else if (type === 'individual') {
//       accountParams.individual = {
//         first_name: first_name,
//         last_name: last_name,
//         dob: {
//           day: new Date(dob).getUTCDate(),
//           month: new Date(dob).getUTCMonth() + 1,
//           year: new Date(dob).getUTCFullYear(),
//         },
//         email: phone,
//         gender: gender,
//         id_number: id_number,
//         id_number_secondary: id_number_secondary,
//         political_exposure: political_exposure,
//         address: {
//           line1: address_line1,
//           line2: address_line2,
//           city: city,
//           state: state,
//           postal_code: postal_code,
//           country: country,
//         },
//         ssn_last_4: ssn_last_4
//       };
//     }

//     const account = await stripe.accounts.create(accountParams);

//     res.status(200).send({ account });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// CREATE ONBOARDING LINK 
app.post('/create-onboarding-link', async (req, res) => {
  const { business_type } = req.body;
  // const account = await stripe.accounts.create({
  //   type: 'express',
  // });

  const accountParams = {
    country: 'US', 
    type: 'express',
    business_type: business_type
    // capabilities: {
    //   card_payments: { requested: true },  // Hardcoded value
    //   transfers: { requested: true }  // Hardcoded value
    // },
    // tos_acceptance: {
    //   date: Math.floor(new Date().getTime() / 1000),  // Hardcoded current date
    //   ip: '0.0.0.0'  // Hardcoded IP address
    // },
  };

  // if (business_type === 'company') {
  //   accountParams.business_profile = {
  //     name: 'Default Company Name',  // Hardcoded value
  //     product_description: 'Default Description',  // Hardcoded value
  //     url: 'http://example.com'  // Hardcoded URL
  //   };
  //   accountParams.business = {
  //     address: {
  //       line1: '123 Default St',  // Hardcoded value
  //       line2: 'Suite 100',  // Hardcoded value
  //       city: 'Default City',  // Hardcoded value
  //       state: 'CA',  // Hardcoded value
  //       postal_code: '90001',  // Hardcoded value
  //       country: 'US'  // Hardcoded value
  //     },
  //     name: 'Default Company Name',  // Hardcoded value
  //     tax_id: '123456789',  // Hardcoded value
  //     vat_id: 'US123456789'  // Hardcoded value
  //   };
  // } else if (business_type === 'individual') {
  //   accountParams.individual = {
  //     first_name: 'John',  // Hardcoded value
  //     last_name: 'Doe',  // Hardcoded value
  //     dob: {
  //       day: 1,  // Hardcoded value
  //       month: 1,  // Hardcoded value
  //       year: 1990,  // Hardcoded value
  //     },
  //     email: 'john.doe@example.com',  // Hardcoded value
  //     gender: 'male',  // Hardcoded value
  //     id_number: '123456789',  // Hardcoded value
  //     id_number_secondary: '987654321',  // Hardcoded value
  //     political_exposure: 'none',  // Hardcoded value
  //     address: {
  //       line1: '123 Default St',  // Hardcoded value
  //       line2: 'Apt 1',  // Hardcoded value
  //       city: 'Default City',  // Hardcoded value
  //       state: 'CA',  // Hardcoded value
  //       postal_code: '90001',  // Hardcoded value
  //       country: 'US',  // Hardcoded value
  //     },
  //     ssn_last_4: '1234'  // Hardcoded value
  //   };
  // }

  const account = await stripe.accounts.create(accountParams);
  console.log(account.id);
  
  const accountLink = await stripe.accountLinks.create({
    account: account.id, 
    return_url: 'http://localhost:3000/',
    type: 'account_onboarding',
  });
console.log(accountLink);

  res.status(201).json({ url: accountLink.url });
});



// PAYMENT ZONE

// CREATE PAYMENT INTENT
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd', paymentMethodId, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      // confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      description: description,
      // mandate : "mandate_1MvojA2eZvKYlo2CvqTABjZs",
      // mandate_data : {
      //   customer_acceptance : {
      //     type: "online",
      //     accepted_at : "2024-08-29",
      //     online: {
      //       ip_address : "192.168.2.32",
      //       user_agent : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"  
      //     }
      //   }
      // }
    });

    res.send(paymentIntent);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE PAYMENT METHOD
app.post('/create-payment-method', async (req, res) => {
  const { accountNumber, routingNumber, name } = req.body;

  try {
    // Create a PaymentMethod for ACH Debit
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'us_bank_account',
      us_bank_account: {
        account_holder_type: 'individual',
        account_number: accountNumber,
        routing_number: routingNumber,
        account_type: 'savings'
      },
      billing_details: {
        name: name,
      },
    });

    res.send(paymentMethod);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



// SUBSCRIPTIONS ZONE

// CREATE A SUBSCRIPTION
app.post('/create-subscription', async (req, res) => {
  const { cus_id, price_id, productName, amount } = req.body;

  try {
    const product = await stripe.products.create({
      name: productName,
    });

    const price = await stripe.prices.create({
      unit_amount: amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      product: product.id,
    });

    const subscription = await stripe.subscriptions.create({
      customer: 'cus_QnAVyMB9REpnvl',
      items: [{ price: price.id }],
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CANCEL A SUBSCRIPTION
app.post('/cancel-subscription', async (req, res) => {
  const { id } = req.body;

  try {
    const canceledSubscription = await stripe.subscriptions.del(id);
    res.status(201).json(canceledSubscription);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// ATTACH PAYMENT METHOD FOR CUSTOMER
app.post('/attach-payment-method', async (req, res) => {
  const { payment_method_id } = req.body;

  try {
    // Attach payment method to the customer
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      { customer: 'cus_QnAVyMB9REpnvl' }
    );

    // Set this payment method as the default for invoices
    await stripe.customers.update('cus_QnAVyMB9REpnvl', {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });
    console.log(res);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ACCOUNT LIST
app.get('/accounts', async (req, res) => {
  const accounts = await stripe.accounts.list({
    limit: 10,
  });

  res.status(200).json(accounts);
});

app.get('/', async (req, res) => {
  res.send('Hello World');
});


app.listen(3000, () => console.log('Server running on port 3000'));
