const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const router = express.Router();

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

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

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').isMobilePhone('en-KE').withMessage('Valid Kenyan phone number is required'),
  body('firstName').isString().isLength({ min: 2 }).withMessage('First name is required'),
  body('lastName').isString().isLength({ min: 2 }).withMessage('Last name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, phoneNumber, firstName, lastName } = req.body;

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
    });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      phoneNumber,
      firstName,
      lastName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      profile: {
        isVerified: false,
        mpesaPIN: null,
        preferences: {
          notifications: true,
          biometric: false,
          darkMode: false
        }
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        uid: userRecord.uid, 
        email: userRecord.email,
        phoneNumber: phoneNumber
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          phoneNumber: userRecord.phoneNumber
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email address' 
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Verify user credentials with Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    // Generate JWT token
    const token = jwt.sign(
      { 
        uid: userRecord.uid, 
        email: userRecord.email,
        phoneNumber: userData.phoneNumber
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          phoneNumber: userData.phoneNumber,
          profile: userData.profile
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (error.code === 'auth/wrong-password') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    res.json({
      success: true,
      data: {
        uid: userData.uid,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profile: userData.profile,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', verifyFirebaseToken, [
  body('firstName').optional().isString().isLength({ min: 2 }),
  body('lastName').optional().isString().isLength({ min: 2 }),
  body('phoneNumber').optional().isMobilePhone('en-KE')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { firstName, lastName, phoneNumber } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    // Update Firestore document
    await admin.firestore().collection('users').doc(uid).update(updateData);

    // Update Firebase Auth display name if both names are provided
    if (firstName && lastName) {
      await admin.auth().updateUser(uid, {
        displayName: `${firstName} ${lastName}`
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', verifyFirebaseToken, [
  body('notifications').optional().isBoolean(),
  body('biometric').optional().isBoolean(),
  body('darkMode').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { notifications, biometric, darkMode } = req.body;

    const updateData = {
      'profile.preferences': {
        notifications: notifications !== undefined ? notifications : true,
        biometric: biometric !== undefined ? biometric : false,
        darkMode: darkMode !== undefined ? darkMode : false
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('users').doc(uid).update(updateData);

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Set M-Pesa PIN
router.post('/mpesa-pin', verifyFirebaseToken, [
  body('pin').isLength({ min: 4, max: 4 }).isNumeric().withMessage('PIN must be 4 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { pin } = req.body;

    // Hash the PIN for security
    const hashedPin = await bcrypt.hash(pin, 10);

    await admin.firestore().collection('users').doc(uid).update({
      'profile.mpesaPIN': hashedPin,
      'profile.isVerified': true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'M-Pesa PIN set successfully'
    });

  } catch (error) {
    console.error('Set M-Pesa PIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set M-Pesa PIN',
      error: error.message
    });
  }
});

// Verify M-Pesa PIN
router.post('/verify-pin', verifyFirebaseToken, [
  body('pin').isLength({ min: 4, max: 4 }).isNumeric().withMessage('PIN must be 4 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { pin } = req.body;

    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userData.profile.mpesaPIN) {
      return res.status(400).json({
        success: false,
        message: 'M-Pesa PIN not set'
      });
    }

    const isValidPin = await bcrypt.compare(pin, userData.profile.mpesaPIN);

    res.json({
      success: true,
      data: {
        isValid: isValidPin
      }
    });

  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify PIN',
      error: error.message
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
