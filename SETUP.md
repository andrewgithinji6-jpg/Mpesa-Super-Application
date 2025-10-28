# M-Pesa+ SuperApp Setup Guide

This guide will walk you through setting up the M-Pesa+ SuperApp project from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`

### Mobile Development
- **Expo Go App** - Install on your phone from App Store/Play Store
- **iOS Simulator** (Mac only) - Install Xcode from App Store
- **Android Studio** (optional) - For Android emulator

### Accounts Needed
- **Firebase Account** - [Sign up here](https://firebase.google.com/)
- **Safaricom Developer Account** - [Register here](https://developer.safaricom.co.ke/)

## 🚀 Step-by-Step Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/mpesa-superapp.git
cd mpesa-superapp

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Firebase Setup

#### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `mpesa-superapp`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### 2.2 Enable Authentication
1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

#### 2.3 Enable Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

#### 2.4 Get Web App Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) icon
4. Register app with name: `M-Pesa SuperApp`
5. Copy the configuration object

#### 2.5 Create Service Account (for Backend)
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure - you'll need it for backend configuration

### Step 3: M-Pesa Daraja API Setup

#### 3.1 Register for Daraja API
1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account
3. Verify your email
4. Log in to the portal

#### 3.2 Create an App
1. Click "My Apps" in the dashboard
2. Click "Create App"
3. Fill in the details:
   - App Name: `M-Pesa SuperApp`
   - Description: `Mobile money app with banking integration`
   - Environment: `Sandbox` (for testing)
4. Submit the form

#### 3.3 Get API Credentials
1. Once approved, go to your app dashboard
2. Copy the following credentials:
   - Consumer Key
   - Consumer Secret
   - Business Short Code
   - Passkey

### Step 4: Environment Configuration

#### 4.1 Frontend Configuration
1. Copy the environment template:
```bash
cp env.example .env
```

2. Edit `.env` with your Firebase configuration:
```env
# Firebase Configuration (from Step 2.4)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend API URL (for development)
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

#### 4.2 Backend Configuration
1. Copy the environment template:
```bash
cd backend
cp env.example .env
```

2. Edit `backend/.env` with your configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Firebase Admin SDK (from Step 2.5)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# M-Pesa Daraja API (from Step 3.3)
MPESA_DARAJA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_PASSKEY=your_passkey
MPESA_INITIATOR_NAME=testapi
MPESA_SECURITY_CREDENTIAL=test

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here
```

### Step 5: Start Development Servers

#### 5.1 Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
🚀 M-Pesa+ SuperApp API running on port 5000
📱 Environment: development
🔗 Health check: http://localhost:5000/health
```

#### 5.2 Start Mobile App
Open a new terminal and run:
```bash
npm start
```

You should see the Expo development server start. Choose your preferred method:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

### Step 6: Test the Application

#### 6.1 Test Backend API
Open your browser and go to:
- `http://localhost:5000` - Should show API information
- `http://localhost:5000/health` - Should show health status

#### 6.2 Test Mobile App
1. Open the app on your device/simulator
2. Try registering a new account
3. Test the login functionality
4. Navigate through the different screens

## 🔧 Troubleshooting

### Common Issues

#### Firebase Configuration Errors
- **Error**: "Firebase project not found"
- **Solution**: Double-check your project ID in `.env` file

#### M-Pesa API Errors
- **Error**: "Invalid credentials"
- **Solution**: Verify your Consumer Key and Secret are correct

#### Port Already in Use
- **Error**: "Port 5000 is already in use"
- **Solution**: Change PORT in `backend/.env` to a different number (e.g., 5001)

#### Expo Connection Issues
- **Error**: "Unable to connect to Expo"
- **Solution**: Make sure your phone and computer are on the same WiFi network

### Getting Help

1. **Check the logs**: Look at both terminal windows for error messages
2. **Verify configuration**: Double-check all environment variables
3. **Test individual components**: Try accessing backend endpoints directly
4. **Check network**: Ensure your internet connection is stable

## 📱 Testing on Physical Device

### iOS Testing
1. Install Expo Go from App Store
2. Scan the QR code from the terminal
3. The app will load on your device

### Android Testing
1. Install Expo Go from Play Store
2. Scan the QR code from the terminal
3. The app will load on your device

### Network Configuration
If testing on physical device:
1. Find your computer's IP address:
   - **Windows**: `ipconfig`
   - **Mac/Linux**: `ifconfig`
2. Update `EXPO_PUBLIC_API_BASE_URL` to use your IP:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000
   ```
3. Restart both servers

## 🚀 Next Steps

Once you have the basic setup working:

1. **Test M-Pesa Integration**: Try the STK Push functionality
2. **Customize the UI**: Modify colors, fonts, and layouts
3. **Add Features**: Implement additional functionality
4. **Deploy**: Set up production environment
5. **Submit to Stores**: Prepare for app store submission

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [M-Pesa Daraja API Documentation](https://developer.safaricom.co.ke/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the error logs
3. Search for similar issues online
4. Create an issue in the repository

---

**Happy coding! 🎉**
