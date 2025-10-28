const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// M-Pesa Daraja API configuration
const DARAJA_BASE_URL = process.env.MPESA_DARAJA_BASE_URL || 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE;
const PASSKEY = process.env.MPESA_PASSKEY;

// Middleware to get access token
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(`${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Generate timestamp and password for STK Push
const generateTimestamp = () => {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
};

const generatePassword = (shortCode, passkey, timestamp) => {
  const passwordString = shortCode + passkey + timestamp;
  return Buffer.from(passwordString).toString('base64');
};

// STK Push - Initiate payment
router.post('/stk-push', [
  body('phoneNumber').isMobilePhone('en-KE').withMessage('Valid Kenyan phone number required'),
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('accountReference').optional().isString().isLength({ max: 50 }),
  body('transactionDesc').optional().isString().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
    
    // Format phone number (remove + and ensure it starts with 254)
    const formattedPhone = phoneNumber.replace(/^\+?254/, '254');
    
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(BUSINESS_SHORT_CODE, PASSKEY, timestamp);

    const stkPushData = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(parseFloat(amount)),
      PartyA: formattedPhone,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.API_BASE_URL}/api/mpesa/stk-push-callback`,
      AccountReference: accountReference || 'M-Pesa+ SuperApp',
      TransactionDesc: transactionDesc || 'Payment via M-Pesa+ SuperApp'
    };

    const response = await axios.post(
      `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'STK Push initiated successfully',
      data: {
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription
      }
    });

  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate STK Push',
      error: error.response?.data || error.message
    });
  }
});

// STK Push Callback
router.post('/stk-push-callback', (req, res) => {
  try {
    const callbackData = req.body;
    console.log('STK Push Callback received:', callbackData);

    // Here you would typically:
    // 1. Verify the callback data
    // 2. Update your database with the transaction status
    // 3. Send notification to the user
    // 4. Update user's balance

    res.status(200).json({ message: 'Callback received successfully' });
  } catch (error) {
    console.error('STK Push callback error:', error);
    res.status(500).json({ message: 'Callback processing failed' });
  }
});

// Query STK Push Status
router.post('/stk-push-status', [
  body('checkoutRequestId').isString().notEmpty().withMessage('Checkout Request ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { checkoutRequestId } = req.body;
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(BUSINESS_SHORT_CODE, PASSKEY, timestamp);

    const queryData = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const response = await axios.post(
      `${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      queryData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: {
        checkoutRequestId: response.data.CheckoutRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
        callbackMetadata: response.data.CallbackMetadata
      }
    });

  } catch (error) {
    console.error('STK Push status query error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to query STK Push status',
      error: error.response?.data || error.message
    });
  }
});

// Send Money (Peer to Peer)
router.post('/send-money', [
  body('phoneNumber').isMobilePhone('en-KE').withMessage('Valid Kenyan phone number required'),
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('remarks').optional().isString().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, amount, remarks } = req.body;
    
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+?254/, '254');
    
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(BUSINESS_SHORT_CODE, PASSKEY, timestamp);

    const b2cData = {
      InitiatorName: process.env.MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || 'test',
      CommandID: 'BusinessPayment',
      Amount: Math.round(parseFloat(amount)),
      PartyA: BUSINESS_SHORT_CODE,
      PartyB: formattedPhone,
      Remarks: remarks || 'Payment via M-Pesa+ SuperApp',
      QueueTimeOutURL: `${process.env.API_BASE_URL}/api/mpesa/b2c-timeout`,
      ResultURL: `${process.env.API_BASE_URL}/api/mpesa/b2c-result`,
      Occasion: 'Payment'
    };

    const response = await axios.post(
      `${DARAJA_BASE_URL}/mpesa/b2c/v1/paymentrequest`,
      b2cData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Send money request initiated successfully',
      data: {
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription
      }
    });

  } catch (error) {
    console.error('Send money error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate send money request',
      error: error.response?.data || error.message
    });
  }
});

// Account Balance
router.get('/balance', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(BUSINESS_SHORT_CODE, PASSKEY, timestamp);

    const balanceData = {
      Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || 'test',
      CommandID: 'AccountBalance',
      PartyA: BUSINESS_SHORT_CODE,
      IdentifierType: '4',
      Remarks: 'Balance inquiry',
      QueueTimeOutURL: `${process.env.API_BASE_URL}/api/mpesa/balance-timeout`,
      ResultURL: `${process.env.API_BASE_URL}/api/mpesa/balance-result`
    };

    const response = await axios.post(
      `${DARAJA_BASE_URL}/mpesa/accountbalance/v1/query`,
      balanceData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: {
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription
      }
    });

  } catch (error) {
    console.error('Balance inquiry error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get account balance',
      error: error.response?.data || error.message
    });
  }
});

// Transaction Status
router.post('/transaction-status', [
  body('transactionId').isString().notEmpty().withMessage('Transaction ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { transactionId } = req.body;
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(BUSINESS_SHORT_CODE, PASSKEY, timestamp);

    const statusData = {
      Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || 'test',
      CommandID: 'TransactionStatusQuery',
      TransactionID: transactionId,
      PartyA: BUSINESS_SHORT_CODE,
      IdentifierType: '4',
      ResultURL: `${process.env.API_BASE_URL}/api/mpesa/transaction-status-result`,
      QueueTimeOutURL: `${process.env.API_BASE_URL}/api/mpesa/transaction-status-timeout`,
      Remarks: 'Transaction status inquiry',
      Occasion: 'Status inquiry'
    };

    const response = await axios.post(
      `${DARAJA_BASE_URL}/mpesa/transactionstatus/v1/query`,
      statusData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: {
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription
      }
    });

  } catch (error) {
    console.error('Transaction status error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to query transaction status',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
