const express = require('express');
const { body, query, validationResult } = require('express-validator');
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

// Get user transactions
router.get('/', verifyFirebaseToken, [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  query('type').optional().isIn(['sent', 'received', 'airtime', 'data', 'bill', 'withdrawal', 'deposit']),
  query('status').optional().isIn(['completed', 'pending', 'failed']),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { 
      limit = 20, 
      offset = 0, 
      type, 
      status, 
      startDate, 
      endDate 
    } = req.query;

    let query = admin.firestore()
      .collection('transactions')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc');

    // Apply filters
    if (type) {
      query = query.where('type', '==', type);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }

    if (startDate) {
      query = query.where('createdAt', '>=', new Date(startDate));
    }

    if (endDate) {
      query = query.where('createdAt', '<=', new Date(endDate));
    }

    // Apply pagination
    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();

    const transactions = [];
    snapshot.forEach(doc => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate()?.toISOString()
      });
    });

    // Get total count for pagination
    const totalSnapshot = await admin.firestore()
      .collection('transactions')
      .where('userId', '==', uid)
      .get();

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: totalSnapshot.size,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: transactions.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions',
      error: error.message
    });
  }
});

// Get transaction by ID
router.get('/:transactionId', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { transactionId } = req.params;

    const transactionDoc = await admin.firestore()
      .collection('transactions')
      .doc(transactionId)
      .get();

    if (!transactionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transactionData = transactionDoc.data();

    // Check if transaction belongs to user
    if (transactionData.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: transactionDoc.id,
        ...transactionData,
        createdAt: transactionData.createdAt?.toDate()?.toISOString(),
        updatedAt: transactionData.updatedAt?.toDate()?.toISOString()
      }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction',
      error: error.message
    });
  }
});

// Create transaction (internal use)
router.post('/', verifyFirebaseToken, [
  body('type').isIn(['sent', 'received', 'airtime', 'data', 'bill', 'withdrawal', 'deposit']).withMessage('Invalid transaction type'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').isString().isLength({ min: 1, max: 200 }).withMessage('Description is required'),
  body('recipient').optional().isString(),
  body('reference').optional().isString(),
  body('status').optional().isIn(['completed', 'pending', 'failed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const {
      type,
      amount,
      description,
      recipient,
      reference,
      status = 'completed'
    } = req.body;

    const transactionData = {
      userId: uid,
      type,
      amount: parseFloat(amount),
      description,
      recipient: recipient || null,
      reference: reference || null,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const transactionRef = await admin.firestore()
      .collection('transactions')
      .add(transactionData);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        id: transactionRef.id,
        ...transactionData
      }
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
});

// Update transaction status
router.put('/:transactionId/status', verifyFirebaseToken, [
  body('status').isIn(['completed', 'pending', 'failed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { transactionId } = req.params;
    const { status } = req.body;

    const transactionRef = admin.firestore().collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transactionData = transactionDoc.data();

    // Check if transaction belongs to user
    if (transactionData.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await transactionRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Transaction status updated successfully'
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction status',
      error: error.message
    });
  }
});

// Get transaction statistics
router.get('/stats/summary', verifyFirebaseToken, [
  query('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('Invalid period')
], async (req, res) => {
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

    const transactionsSnapshot = await admin.firestore()
      .collection('transactions')
      .where('userId', '==', uid)
      .where('createdAt', '>=', startDate)
      .where('status', '==', 'completed')
      .get();

    let totalSent = 0;
    let totalReceived = 0;
    let totalAirtime = 0;
    let totalData = 0;
    let totalBills = 0;
    let transactionCount = 0;

    transactionsSnapshot.forEach(doc => {
      const transaction = doc.data();
      transactionCount++;

      switch (transaction.type) {
        case 'sent':
        case 'withdrawal':
          totalSent += transaction.amount;
          break;
        case 'received':
        case 'deposit':
          totalReceived += transaction.amount;
          break;
        case 'airtime':
          totalAirtime += transaction.amount;
          break;
        case 'data':
          totalData += transaction.amount;
          break;
        case 'bill':
          totalBills += transaction.amount;
          break;
      }
    });

    res.json({
      success: true,
      data: {
        period,
        summary: {
          totalSent,
          totalReceived,
          totalAirtime,
          totalData,
          totalBills,
          transactionCount,
          netAmount: totalReceived - totalSent - totalAirtime - totalData - totalBills
        },
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction statistics',
      error: error.message
    });
  }
});

// Get recent transactions
router.get('/stats/recent', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const recentTransactionsSnapshot = await admin.firestore()
      .collection('transactions')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const recentTransactions = [];
    recentTransactionsSnapshot.forEach(doc => {
      recentTransactions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString()
      });
    });

    res.json({
      success: true,
      data: {
        recentTransactions
      }
    });

  } catch (error) {
    console.error('Get recent transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent transactions',
      error: error.message
    });
  }
});

module.exports = router;
