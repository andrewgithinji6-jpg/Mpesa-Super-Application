# M-Pesa+ SuperApp 🚀

A modern, comprehensive mobile money application that integrates M-Pesa services with banking and utility services in one unified platform.

## 📱 Features

### Core Features
- **M-Pesa Integration**: Send money, buy airtime, pay bills
- **Bank Services**: Transfer money between M-Pesa and bank accounts
- **Data & SMS Bundles**: Purchase data bundles, SMS plans, and Bonga Points
- **Transaction History**: Complete transaction tracking and filtering
- **User Authentication**: Secure Firebase-based authentication
- **Modern UI**: Beautiful, intuitive interface with Safaricom branding

### Technical Features
- **React Native + Expo**: Cross-platform mobile development
- **Node.js Backend**: RESTful API with Express.js
- **Firebase**: Authentication and database
- **M-Pesa Daraja API**: Official Safaricom integration
- **Real-time Updates**: Live transaction notifications
- **Offline Support**: Core functionality works offline

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Firebase SDK** for authentication
- **Expo Vector Icons** for icons
- **React Native Animatable** for animations
- **Linear Gradient** for beautiful gradients

### Backend (API Server)
- **Node.js** with Express.js
- **Firebase Admin SDK** for server-side operations
- **M-Pesa Daraja API** integration
- **JWT** for authentication
- **Express Validator** for input validation
- **CORS** for cross-origin requests
- **Helmet** for security

### Database & Services
- **Firebase Firestore** for data storage
- **Firebase Authentication** for user management
- **M-Pesa Daraja API** for mobile money operations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project
- M-Pesa Daraja API credentials (for sandbox testing)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mpesa-superapp.git
cd mpesa-superapp
```

### 2. Install Dependencies

#### Frontend (React Native)
```bash
npm install
```

#### Backend (Node.js)
```bash
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend Configuration
1. Copy `env.example` to `.env`
2. Fill in your Firebase configuration:
```bash
cp env.example .env
```

Edit `.env` with your Firebase project details:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

#### Backend Configuration
1. Copy `backend/env.example` to `backend/.env`
2. Fill in your configuration:
```bash
cd backend
cp env.example .env
```

Edit `backend/.env` with your details:
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

# M-Pesa Daraja API
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_PASSKEY=your_passkey

# JWT Secret
JWT_SECRET=your_jwt_secret

# Server Configuration
PORT=5000
API_BASE_URL=http://localhost:5000
```

### 4. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database

2. **Get Firebase Configuration**:
   - Go to Project Settings > General
   - Add a web app to get the configuration
   - Copy the config values to your `.env` file

3. **Set up Firebase Admin SDK**:
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Download the JSON file and extract the values for your backend `.env`

### 5. M-Pesa Daraja API Setup

1. **Register for Daraja API**:
   - Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
   - Create an account and register your app
   - Get your Consumer Key and Consumer Secret

2. **Configure Callback URLs**:
   - Set up your callback URLs for production
   - For development, use ngrok or similar tool

### 6. Start the Development Servers

#### Start the Backend Server
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Start the Mobile App
```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your phone

## 📱 App Screenshots

### Home Dashboard
- Balance display with show/hide toggle
- Quick action buttons (Send Money, Buy Airtime, Pay Bill)
- Service cards (Data, SMS, Bonga Points)
- Recent transactions list

### Transactions
- Complete transaction history
- Filter by type, status, and date range
- Search functionality
- Transaction details and status

### Services
- Data bundles with different sizes and validity periods
- SMS bundles with various message counts
- Bonga Points purchase options
- Service balance tracking

### Bank Services
- Bank account management
- M-Pesa to Bank transfers
- Bank to M-Pesa transfers
- Transfer history and status

### Settings
- User profile management
- PIN change functionality
- App preferences (dark mode, notifications)
- Security settings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/mpesa-pin` - Set M-Pesa PIN

### M-Pesa Operations
- `POST /api/mpesa/stk-push` - Initiate STK Push payment
- `POST /api/mpesa/send-money` - Send money to another user
- `GET /api/mpesa/balance` - Get account balance
- `POST /api/mpesa/transaction-status` - Query transaction status

### Transactions
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get specific transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics

### Services
- `GET /api/services/plans` - Get available service plans
- `GET /api/services/balances` - Get user service balances
- `POST /api/services/purchase` - Purchase service

### Bank Services
- `GET /api/bank/accounts` - Get bank accounts
- `POST /api/bank/transfer-to-bank` - Transfer to bank
- `POST /api/bank/transfer-from-bank` - Transfer from bank
- `GET /api/bank/transfers` - Get transfer history

## 🔒 Security Features

- **Firebase Authentication** with email/password
- **JWT tokens** for API authentication
- **Input validation** on all endpoints
- **Rate limiting** to prevent abuse
- **CORS protection** for cross-origin requests
- **Helmet.js** for security headers
- **Encrypted PIN storage** using bcrypt

## 📦 Project Structure

```
mpesa-superapp/
├── src/                          # React Native source code
│   ├── screens/                  # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── ServicesScreen.tsx
│   │   ├── BankServicesScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── context/                  # React Context providers
│   │   └── AuthContext.tsx
│   └── config/                   # Configuration files
│       └── firebase.ts
├── backend/                      # Node.js backend
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── mpesa.js
│   │   ├── transactions.js
│   │   ├── services.js
│   │   └── bank.js
│   ├── server.js                 # Main server file
│   └── package.json
├── assets/                       # App assets (icons, images)
├── App.tsx                       # Main app component
├── app.json                      # Expo configuration
└── package.json                  # Frontend dependencies
```

## 🚀 Deployment

### Frontend Deployment (Expo)
1. **Build for Production**:
```bash
expo build:android
expo build:ios
```

2. **Deploy to App Stores**:
- Follow Expo's deployment guide
- Submit to Google Play Store and Apple App Store

### Backend Deployment
1. **Deploy to Cloud Platform**:
   - Heroku, AWS, DigitalOcean, or similar
   - Set environment variables
   - Configure domain and SSL

2. **Update Frontend Configuration**:
   - Update `EXPO_PUBLIC_API_BASE_URL` to your production URL

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Safaricom for the M-Pesa Daraja API
- Firebase for authentication and database services
- Expo team for the amazing development platform
- React Native community for excellent documentation

## 📞 Support

For support, email support@mpesa-superapp.com or join our Slack channel.

## 🔮 Roadmap

- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Offline transaction sync
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Integration with more banks
- [ ] Bill payment integrations
- [ ] Investment features

---

**Made with ❤️ for the Kenyan mobile money ecosystem**
