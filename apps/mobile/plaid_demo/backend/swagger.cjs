const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Torus Plaid APIS',
      version: '1.0.0',
      description: 'An API for communicating with Plaid',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    paths: {
      '/api/create-link-token': {
        post: {
          summary: 'Create a link token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    client_id: { type: 'string' },
                    secret: { type: 'string' },
                    client_name: { type: 'string' },
                    country_codes: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    language: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        client_user_id: { type: 'string' },
                      },
                    },
                    products: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['client_name', 'country_codes', 'language', 'user', 'products'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully created link token',
            },
            400: {
              description: 'Invalid request payload',
            },
          },
        },
      },
      '/api/create-public-token': {
        post: {
          summary: 'Create a public token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    client_id: { type: 'string' },
                    secret: { type: 'string' },
                    institution_id: { type: 'string' },
                    initial_products: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['institution_id', 'initial_products'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully created public token',
            },
            400: {
              description: 'Invalid request payload',
            },
          },
        },
      },
      '/api/exchange-public-token': {
        post: {
          summary: 'Exchange a public token for an access token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    client_id: { type: 'string' },
                    secret: { type: 'string' },
                    public_token: { type: 'string' },
                  },
                  required: ['public_token'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully exchanged public token',
            },
            400: {
              description: 'Invalid request payload',
            },
          },
        },
      },
      '/api/auth': {
        post: {
          summary: 'Retrieve authentication data',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    client_id: { type: 'string' },
                    secret: { type: 'string' },
                    access_token: { type: 'string' },
                  },
                  required: ['access_token'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully retrieved authentication data',
            },
            400: {
              description: 'Invalid request payload',
            },
          },
        },
      },
      '/balance-auth': {
        post: {
          summary: 'Create a public token for authentication',
          tags: ['Balance'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    institution_id: { type: 'string' },
                  },
                  required: ['institution_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully created public token for authentication',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/exchange-public-token': {
        post: {
          summary: 'Exchange a public token for an access token',
          tags: ['Balance'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    public_token: { type: 'string' },
                  },
                  required: ['public_token'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully exchanged public token',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/check-balance': {
        post: {
          summary: 'Check the balance of a specific account',
          tags: ['Balance'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access_token: { type: 'string' },
                    account_id: { type: 'string' },
                  },
                  required: ['access_token', 'account_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully retrieved account balance',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      balances: {
                        type: 'object',
                        properties: {
                          available: { type: 'number' },
                          current: { type: 'number' },
                          limit: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid request payload or missing parameters',
            },
            404: {
              description: 'Account not found in Plaid',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-ledger-withdraw': {
        post: {
          summary: 'Perform a ledger withdrawal transfer',
          tags: ['Ledger'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number' },
                    network: { type: 'string' },
                    idempotency_key: { type: 'string' },
                    description: { type: 'string' },
                  },
                  required: ['amount', 'network', 'idempotency_key', 'description'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully performed ledger withdrawal transfer',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-ledger-withdraw-simulate': {
        post: {
          summary: 'Simulate a ledger withdrawal transfer',
          tags: ['Ledger'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    sweep_id: { type: 'string' },
                    event_type: { type: 'string' },
                  },
                  required: ['sweep_id', 'event_type'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully simulated ledger withdrawal transfer',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-ledger-withdraw-simulate-available': {
        post: {
          summary: 'Simulate an available ledger withdrawal transfer',
          tags: ['Ledger'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    client_id: { type: 'string' },
                    secret: { type: 'string' },
                  },
                  required: ['client_id', 'secret'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully simulated available ledger withdrawal transfer',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/api/transactions': {
        post: {
          summary: 'Get transactions within a date range',
          tags: ['Transactions'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    client_id: { type: 'string' },
                    secret: { type: 'string' },
                    access_token: { type: 'string' },
                    start_date: { type: 'string', format: 'date' },
                    end_date: { type: 'string', format: 'date' },
                  },
                  required: ['access_token'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully retrieved transactions',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      transactions: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            transaction_id: { type: 'string' },
                            amount: { type: 'number' },
                            date: { type: 'string', format: 'date' },
                            name: { type: 'string' },
                            category: { type: 'array', items: { type: 'string' } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/get-item-account-info': {
        post: {
          summary: 'Retrieve account information for a specific item',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access_token: { type: 'string' },
                  },
                  required: ['access_token'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully retrieved account information',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/authorize': {
        post: {
          summary: 'Authorize a transfer',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access_token: { type: 'string' },
                    account_id: { type: 'string' },
                    type: { type: 'string' },
                    network: { type: 'string' },
                    ach_class: { type: 'string' },
                    amount: { type: 'number' },
                    user: {
                      type: 'object',
                      properties: {
                        legal_name: { type: 'string' },
                        email: { type: 'string' },
                      },
                      required: ['legal_name', 'email'],
                    },
                  },
                  required: ['access_token', 'account_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully authorized transfer',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/initiate': {
        post: {
          summary: 'Initiate a transfer',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access_token: { type: 'string' },
                    account_id: { type: 'string' },
                    type: { type: 'string' },
                    network: { type: 'string' },
                    ach_class: { type: 'string' },
                    amount: { type: 'number' },
                    iso_currency_code: { type: 'string' },
                    description: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        legal_name: { type: 'string' },
                        email: { type: 'string' },
                      },
                      required: ['legal_name', 'email'],
                    },
                    origination_account_id: { type: 'string' },
                    metadata: {
                      type: 'object',
                      properties: {
                        custom_tag: { type: 'string' },
                      },
                    },
                    authorization_id: { type: 'string' },
                  },
                  required: [
                    'access_token', 'account_id', 'type', 'network', 'ach_class', 'amount', 
                    'iso_currency_code', 'description', 'user', 'origination_account_id', 'metadata', 'authorization_id'
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully initiated transfer',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-intent-create': {
        post: {
          summary: 'Create a transfer intent',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    account_id: { type: 'string' },
                    mode: { type: 'string' },
                    ach_class: { type: 'string' },
                    amount: { type: 'number' },
                    user: {
                      type: 'object',
                      properties: {
                        legal_name: { type: 'string' },
                        email: { type: 'string' },
                      },
                      required: ['legal_name', 'email'],
                    },
                    description: { type: 'string' },
                    origination_account_id: { type: 'string' },
                  },
                  required: ['account_id', 'mode', 'ach_class', 'amount', 'user', 'description', 'origination_account_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully created transfer intent',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/list-transfer-events': {
        post: {
          summary: 'List transfer events',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    start_date: { type: 'string', format: 'date' },
                    end_date: { type: 'string', format: 'date' },
                    event_types: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    transfer_id: { type: 'string' },
                    origination_account_id: { type: 'string' },
                    direction: { type: 'string' },
                  },
                  required: ['start_date', 'end_date', 'event_types', 'transfer_id', 'origination_account_id', 'direction'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully listed transfer events',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-event-sync': {
        post: {
          summary: 'Sync transfer events',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    after_id: { type: 'string' },
                  },
                  required: ['after_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully synced transfer events',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/event-simulate': {
        post: {
          summary: 'Simulate a transfer event',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    transfer_id: { type: 'string' },
                    event_type: { type: 'string' },
                  },
                  required: ['transfer_id', 'event_type'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully simulated transfer event',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/get-transfer-id': {
        post: {
          summary: 'Get transfer intent details',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    transfer_intent_id: { type: 'string' },
                  },
                  required: ['transfer_intent_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully retrieved transfer intent details',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-get': {
        post: {
          summary: 'Get transfer details',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    transfer_id: { type: 'string' },
                  },
                  required: ['transfer_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully retrieved transfer details',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-list': {
        post: {
          summary: 'List transfers',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    start_date: { type: 'string', format: 'date' },
                    end_date: { type: 'string', format: 'date' },
                    count: { type: 'integer' },
                    offset: { type: 'integer' },
                    origination_account_id: { type: 'string' },
                  },
                  required: ['start_date', 'end_date', 'count', 'offset', 'origination_account_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully listed transfers',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/transfer-cancel': {
        post: {
          summary: 'Cancel a transfer',
          tags: ['Transfer'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    transfer_id: { type: 'string' },
                  },
                  required: ['transfer_id'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully canceled transfer',
            },
            400: {
              description: 'Invalid request payload',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
    },
  },
  apis: ['./index.js'],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = {
  specs,
  ui: swaggerUi,
};

module.exports = swaggerDocs;
