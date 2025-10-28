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

// Mock data plans
const dataPlans = [
  {
    id: 'data1',
    name: 'Daily Bundle',
    price: 50,
    description: '100MB + 50MB YouTube',
    validity: '24 hours',
    size: '150MB',
    popular: false,
    category: 'data'
  },
  {
    id: 'data2',
    name: 'Weekly Bundle',
    price: 250,
    description: '1GB + 500MB YouTube',
    validity: '7 days',
    size: '1.5GB',
    popular: true,
    category: 'data'
  },
  {
    id: 'data3',
    name: 'Monthly Bundle',
    price: 1000,
    description: '5GB + 2GB YouTube + WhatsApp',
    validity: '30 days',
    size: '7GB',
    popular: false,
    category: 'data'
  },
  {
    id: 'data4',
    name: 'Super Bundle',
    price: 2000,
    description: '15GB + 5GB YouTube + Facebook',
    validity: '30 days',
    size: '20GB',
    popular: false,
    category: 'data'
  }
];

// Mock SMS plans
const smsPlans = [
  {
    id: 'sms1',
    name: 'SMS 50',
    price: 30,
    description: '50 SMS messages',
    validity: '7 days',
    count: 50,
    popular: false,
    category: 'sms'
  },
  {
    id: 'sms2',
    name: 'SMS 100',
    price: 50,
    description: '100 SMS messages',
    validity: '14 days',
    count: 100,
    popular: true,
    category: 'sms'
  },
  {
    id: 'sms3',
    name: 'SMS 500',
    price: 200,
    description: '500 SMS messages',
    validity: '30 days',
    count: 500,
    popular: false,
    category: 'sms'
  }
];

// Mock Bonga Points plans
const bongaPlans = [
  {
    id: 'bonga1',
    name: 'Points Purchase',
    price: 100,
    description: 'Buy Bonga Points',
    count: 100,
    popular: false,
    category: 'bonga'
  },
  {
    id: 'bonga2',
    name: 'Points Purchase',
    price: 500,
    description: 'Buy Bonga Points',
    count: 550,
    popular: true,
    category: 'bonga'
  },
  {
    id: 'bonga3',
    name: 'Points Purchase',
    price: 1000,
    description: 'Buy Bonga Points',
    count: 1200,
    popular: false,
    category: 'bonga'
  }
];

// Get all service plans
router.get('/plans', verifyFirebaseToken, async (req, res) => {
  try {
    const { category } = req.query;

    let plans = [];
    
    if (!category) {
      plans = [...dataPlans, ...smsPlans, ...bongaPlans];
    } else {
      switch (category) {
        case 'data':
          plans = dataPlans;
          break;
        case 'sms':
          plans = smsPlans;
          break;
        case 'bonga':
          plans = bongaPlans;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid category. Must be: data, sms, or bonga'
          });
      }
    }

    res.json({
      success: true,
      data: {
        plans,
        total: plans.length
      }
    });

  } catch (error) {
    console.error('Get service plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service plans',
      error: error.message
    });
  }
});

// Get user service balances
router.get('/balances', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    // Get user's service balances from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    const balances = userData.serviceBalances || {
      data: { amount: '2.5 GB', expiry: '2024-02-15' },
      sms: { amount: '100 SMS', expiry: '2024-02-20' },
      bonga: { amount: '2,500 pts', expiry: null }
    };

    res.json({
      success: true,
      data: {
        balances
      }
    });

  } catch (error) {
    console.error('Get service balances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service balances',
      error: error.message
    });
  }
});

// Purchase service
router.post('/purchase', verifyFirebaseToken, [
  body('planId').isString().notEmpty().withMessage('Plan ID is required'),
  body('phoneNumber').optional().isMobilePhone('en-KE').withMessage('Valid Kenyan phone number required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { planId, phoneNumber } = req.body;

    // Find the plan
    let selectedPlan = null;
    let category = '';

    // Check data plans
    const dataPlan = dataPlans.find(plan => plan.id === planId);
    if (dataPlan) {
      selectedPlan = dataPlan;
      category = 'data';
    }

    // Check SMS plans
    if (!selectedPlan) {
      const smsPlan = smsPlans.find(plan => plan.id === planId);
      if (smsPlan) {
        selectedPlan = smsPlan;
        category = 'sms';
      }
    }

    // Check Bonga plans
    if (!selectedPlan) {
      const bongaPlan = bongaPlans.find(plan => plan.id === planId);
      if (bongaPlan) {
        selectedPlan = bongaPlan;
        category = 'bonga';
      }
    }

    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Service plan not found'
      });
    }

    // Create purchase record
    const purchaseData = {
      userId: uid,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      category: selectedPlan.category,
      price: selectedPlan.price,
      description: selectedPlan.description,
      phoneNumber: phoneNumber || null,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const purchaseRef = await admin.firestore()
      .collection('service_purchases')
      .add(purchaseData);

    // In a real implementation, this would integrate with M-Pesa STK Push
    // For now, we'll simulate a successful purchase after a delay
    setTimeout(async () => {
      try {
        await purchaseRef.update({
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Update user's service balances
        const userRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        let serviceBalances = userData.serviceBalances || {};

        switch (category) {
          case 'data':
            // Add data bundle (simplified logic)
            const currentData = serviceBalances.data || { amount: '0 GB' };
            const newDataAmount = parseFloat(currentData.amount) + parseFloat(selectedPlan.size);
            serviceBalances.data = {
              amount: `${newDataAmount} GB`,
              expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
            };
            break;
          
          case 'sms':
            // Add SMS bundle
            const currentSMS = serviceBalances.sms || { amount: '0 SMS' };
            const newSMSAmount = parseInt(currentSMS.amount) + selectedPlan.count;
            serviceBalances.sms = {
              amount: `${newSMSAmount} SMS`,
              expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
            };
            break;
          
          case 'bonga':
            // Add Bonga points
            const currentBonga = serviceBalances.bonga || { amount: '0 pts' };
            const newBongaAmount = parseInt(currentBonga.amount.replace(/[^\d]/g, '')) + selectedPlan.count;
            serviceBalances.bonga = {
              amount: `${newBongaAmount.toLocaleString()} pts`,
              expiry: null // Points don't expire
            };
            break;
        }

        await userRef.update({
          serviceBalances,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create transaction record
        await admin.firestore().collection('transactions').add({
          userId: uid,
          type: category,
          amount: selectedPlan.price,
          description: `Purchase: ${selectedPlan.name}`,
          status: 'completed',
          reference: purchaseRef.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      } catch (error) {
        console.error('Error completing purchase:', error);
        await purchaseRef.update({
          status: 'failed',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }, 2000); // Simulate 2-second processing time

    res.json({
      success: true,
      message: 'Service purchase initiated successfully',
      data: {
        purchaseId: purchaseRef.id,
        plan: selectedPlan,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Purchase service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase service',
      error: error.message
    });
  }
});

// Get user's purchase history
router.get('/purchases', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit = 20, offset = 0 } = req.query;

    const purchasesSnapshot = await admin.firestore()
      .collection('service_purchases')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const purchases = [];
    purchasesSnapshot.forEach(doc => {
      purchases.push({
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
        purchases,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: purchases.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get purchase history',
      error: error.message
    });
  }
});

// Get purchase by ID
router.get('/purchases/:purchaseId', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { purchaseId } = req.params;

    const purchaseDoc = await admin.firestore()
      .collection('service_purchases')
      .doc(purchaseId)
      .get();

    if (!purchaseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    const purchaseData = purchaseDoc.data();

    // Check if purchase belongs to user
    if (purchaseData.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: purchaseDoc.id,
        ...purchaseData,
        createdAt: purchaseData.createdAt?.toDate()?.toISOString(),
        updatedAt: purchaseData.updatedAt?.toDate()?.toISOString(),
        completedAt: purchaseData.completedAt?.toDate()?.toISOString()
      }
    });

  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get purchase',
      error: error.message
    });
  }
});

module.exports = router;
