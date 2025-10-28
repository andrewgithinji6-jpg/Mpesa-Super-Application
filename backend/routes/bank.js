const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's bank accounts
router.get('/accounts', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const accountsSnapshot = await admin.firestore()
      .collection('bank_accounts')
      .where('userId', '==', uid)
      .get();

    const accounts = [];
    accountsSnapshot.forEach(doc => {
      accounts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate()?.toISOString()
      });
    });

    // If no accounts found, return mock data for demo
    if (accounts.length === 0) {
      const mockAccounts = [
        {
          id: 'mock1',
          bankName: 'KCB Bank',
          accountNumber: '1234567890',
          accountName: 'John Doe',
          balance: 'KES 45,230.00',
          accountType: 'Savings',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'mock2',
          bankName: 'Equity Bank',
          accountNumber: '0987654321',
          accountName: 'John Doe',
          balance: 'KES 12,500.00',
          accountType: 'Current',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'mock3',
          bankName: 'Cooperative Bank',
          accountNumber: '1122334455',
          accountName: 'John Doe',
          balance: 'KES 8,750.00',
          accountType: 'Savings',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      return res.json({
        success: true,
        data: {
          accounts: mockAccounts,
          total: mockAccounts.length
        }
      });
    }

    res.json({
      success: true,
      data: {
        accounts,
        total: accounts.length
      }
    });

  } catch (error) {
    console.error('Get bank accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bank accounts',
      error: error.message
    });
  }
});

// Add bank account
router.post('/accounts', verifyFirebaseToken, [
  body('bankName').isString().notEmpty().withMessage('Bank name is required'),
  body('accountNumber').isString().isLength({ min: 8, max: 15 }).withMessage('Valid account number is required'),
  body('accountName').isString().notEmpty().withMessage('Account name is required'),
  body('accountType').isIn(['Savings', 'Current', 'Fixed Deposit']).withMessage('Invalid account type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { bankName, accountNumber, accountName, accountType } = req.body;

    // Check if account already exists
    const existingAccountSnapshot = await admin.firestore()
      .collection('bank_accounts')
      .where('userId', '==', uid)
      .where('accountNumber', '==', accountNumber)
      .get();

    if (!existingAccountSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Bank account already exists'
      });
    }

    const accountData = {
      userId: uid,
      bankName,
      accountNumber,
      accountName,
      accountType,
      balance: 'KES 0.00', // Will be updated after verification
      isVerified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const accountRef = await admin.firestore()
      .collection('bank_accounts')
      .add(accountData);

    res.status(201).json({
      success: true,
      message: 'Bank account added successfully',
      data: {
        id: accountRef.id,
        ...accountData
      }
    });

  } catch (error) {
    console.error('Add bank account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bank account',
      error: error.message
    });
  }
});

// Transfer money to bank
router.post('/transfer-to-bank', verifyFirebaseToken, [
  body('accountId').isString().notEmpty().withMessage('Account ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('reference').optional().isString().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { accountId, amount, reference } = req.body;

    // Get bank account details
    const accountDoc = await admin.firestore()
      .collection('bank_accounts')
      .doc(accountId)
      .get();

    if (!accountDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    const accountData = accountDoc.data();

    // Check if account belongs to user
    if (accountData.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create transfer record
    const transferData = {
      userId: uid,
      type: 'mpesa_to_bank',
      accountId,
      bankName: accountData.bankName,
      accountNumber: accountData.accountNumber,
      amount: parseFloat(amount),
      reference: reference || null,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const transferRef = await admin.firestore()
      .collection('bank_transfers')
      .add(transferData);

    // In a real implementation, this would integrate with M-Pesa and bank APIs
    // For now, we'll simulate a successful transfer after a delay
    setTimeout(async () => {
      try {
        await transferRef.update({
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create transaction record
        await admin.firestore().collection('transactions').add({
          userId: uid,
          type: 'withdrawal',
          amount: parseFloat(amount),
          description: `Transfer to ${accountData.bankName}`,
          recipient: accountData.accountNumber,
          reference: transferRef.id,
          status: 'completed',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      } catch (error) {
        console.error('Error completing transfer:', error);
        await transferRef.update({
          status: 'failed',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }, 3000); // Simulate 3-second processing time

    res.json({
      success: true,
      message: 'Transfer initiated successfully',
      data: {
        transferId: transferRef.id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Transfer to bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate transfer',
      error: error.message
    });
  }
});

// Transfer money from bank
router.post('/transfer-from-bank', verifyFirebaseToken, [
  body('accountId').isString().notEmpty().withMessage('Account ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('reference').optional().isString().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { accountId, amount, reference } = req.body;

    // Get bank account details
    const accountDoc = await admin.firestore()
      .collection('bank_accounts')
      .doc(accountId)
      .get();

    if (!accountDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    const accountData = accountDoc.data();

    // Check if account belongs to user
    if (accountData.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create transfer record
    const transferData = {
      userId: uid,
      type: 'bank_to_mpesa',
      accountId,
      bankName: accountData.bankName,
      accountNumber: accountData.accountNumber,
      amount: parseFloat(amount),
      reference: reference || null,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const transferRef = await admin.firestore()
      .collection('bank_transfers')
      .add(transferData);

    // Simulate successful transfer
    setTimeout(async () => {
      try {
        await transferRef.update({
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create transaction record
        await admin.firestore().collection('transactions').add({
          userId: uid,
          type: 'deposit',
          amount: parseFloat(amount),
          description: `Transfer from ${accountData.bankName}`,
          recipient: accountData.accountNumber,
          reference: transferRef.id,
          status: 'completed',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      } catch (error) {
        console.error('Error completing transfer:', error);
        await transferRef.update({
          status: 'failed',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }, 3000);

    res.json({
      success: true,
      message: 'Transfer initiated successfully',
      data: {
        transferId: transferRef.id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Transfer from bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate transfer',
      error: error.message
    });
  }
});

// Get bank transfer history
router.get('/transfers', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit = 20, offset = 0 } = req.query;

    const transfersSnapshot = await admin.firestore()
      .collection('bank_transfers')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const transfers = [];
    transfersSnapshot.forEach(doc => {
      transfers.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
        completedAt: doc.data().completedAt?.toDate()?.toISOString()
      });
    });

    res.json({
      success: true,
      data: {
        transfers,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: transfers.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get bank transfers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bank transfers',
      error: error.message
    });
  }
});

// Get bank transfer by ID
router.get('/transfers/:transferId', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { transferId } = req.params;

    const transferDoc = await admin.firestore()
      .collection('bank_transfers')
      .doc(transferId)
      .get();

    if (!transferDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    const transferData = transferDoc.data();

    // Check if transfer belongs to user
    if (transferData.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: transferDoc.id,
        ...transferData,
        createdAt: transferData.createdAt?.toDate()?.toISOString(),
        updatedAt: transferData.updatedAt?.toDate()?.toISOString(),
        completedAt: transferData.completedAt?.toDate()?.toISOString()
      }
    });

  } catch (error) {
    console.error('Get bank transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bank transfer',
      error: error.message
    });
  }
});

// Get bank transfer statistics
router.get('/stats', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { period = 'month' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const transfersSnapshot = await admin.firestore()
      .collection('bank_transfers')
      .where('userId', '==', uid)
      .where('createdAt', '>=', startDate)
      .where('status', '==', 'completed')
      .get();

    let totalToBank = 0;
    let totalFromBank = 0;
    let transferCount = 0;

    transfersSnapshot.forEach(doc => {
      const transfer = doc.data();
      transferCount++;

      if (transfer.type === 'mpesa_to_bank') {
        totalToBank += transfer.amount;
      } else if (transfer.type === 'bank_to_mpesa') {
        totalFromBank += transfer.amount;
      }
    });

    res.json({
      success: true,
      data: {
        period,
        summary: {
          totalToBank,
          totalFromBank,
          transferCount,
          netTransfer: totalFromBank - totalToBank
        },
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Get bank transfer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bank transfer statistics',
      error: error.message
    });
  }
});

module.exports = router;
