# M-Pesa+ SuperApp Backend API

This is the backend API server for the M-Pesa+ SuperApp, built with Node.js and Express.

## 🚀 Features

- **RESTful API** with Express.js
- **Firebase Authentication** integration
- **M-Pesa Daraja API** integration
- **JWT** token-based authentication
- **Input validation** with express-validator
- **Rate limiting** for security
- **CORS** support
- **Error handling** middleware
- **Logging** with Morgan
- **Security** with Helmet

## 📁 Project Structure

```
backend/
├── routes/                  # API route handlers
│   ├── auth.js             # Authentication routes
│   ├── mpesa.js            # M-Pesa integration routes
│   ├── transactions.js     # Transaction management
│   ├── services.js         # Service plans and purchases
│   └── bank.js             # Bank transfer operations
├── middleware/             # Custom middleware
├── utils/                  # Utility functions
├── server.js               # Main server file
├── package.json            # Dependencies
└── .env.example           # Environment variables template
```

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

3. **Configure your environment variables** in `.env`

4. **Start the development server**:
```bash
npm run dev
```

## 🔧 Environment Variables

### Required Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

# M-Pesa Daraja API
MPESA_DARAJA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_PASSKEY=your_passkey

# JWT Configuration
JWT_SECRET=your_jwt_secret
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/mpesa-pin` - Set M-Pesa PIN
- `POST /api/auth/verify-pin` - Verify M-Pesa PIN

### M-Pesa Operations
- `POST /api/mpesa/stk-push` - Initiate STK Push payment
- `POST /api/mpesa/send-money` - Send money to another user
- `GET /api/mpesa/balance` - Get account balance
- `POST /api/mpesa/transaction-status` - Query transaction status

### Transactions
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id/status` - Update transaction status
- `GET /api/transactions/stats/summary` - Get transaction statistics

### Services
- `GET /api/services/plans` - Get available service plans
- `GET /api/services/balances` - Get user service balances
- `POST /api/services/purchase` - Purchase service
- `GET /api/services/purchases` - Get purchase history

### Bank Services
- `GET /api/bank/accounts` - Get bank accounts
- `POST /api/bank/accounts` - Add bank account
- `POST /api/bank/transfer-to-bank` - Transfer to bank
- `POST /api/bank/transfer-from-bank` - Transfer from bank
- `GET /api/bank/transfers` - Get transfer history
- `GET /api/bank/stats` - Get transfer statistics

## 🔐 Authentication

The API uses Firebase Authentication with JWT tokens:

1. **Register/Login** with Firebase
2. **Get JWT token** from the response
3. **Include token** in Authorization header: `Bearer <token>`
4. **Access protected endpoints**

Example:
```javascript
const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 📊 M-Pesa Integration

### STK Push Flow
1. **Initiate STK Push** - `POST /api/mpesa/stk-push`
2. **User enters PIN** on phone
3. **Callback received** - `POST /api/mpesa/stk-push-callback`
4. **Query status** - `POST /api/mpesa/stk-push-status`

### Send Money Flow
1. **Initiate transfer** - `POST /api/mpesa/send-money`
2. **User confirms** on phone
3. **Callback received** - `POST /api/mpesa/b2c-result`
4. **Transaction recorded** in database

## 🗄️ Database Schema

### Firestore Collections

#### Users
```javascript
{
  uid: string,
  email: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  profile: {
    isVerified: boolean,
    mpesaPIN: string, // hashed
    preferences: {
      notifications: boolean,
      biometric: boolean,
      darkMode: boolean
    }
  },
  serviceBalances: {
    data: { amount: string, expiry: string },
    sms: { amount: string, expiry: string },
    bonga: { amount: string, expiry: string }
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Transactions
```javascript
{
  userId: string,
  type: 'sent' | 'received' | 'airtime' | 'data' | 'bill' | 'withdrawal' | 'deposit',
  amount: number,
  description: string,
  recipient: string,
  reference: string,
  status: 'completed' | 'pending' | 'failed',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Service Purchases
```javascript
{
  userId: string,
  planId: string,
  planName: string,
  category: 'data' | 'sms' | 'bonga',
  price: number,
  description: string,
  phoneNumber: string,
  status: 'pending' | 'completed' | 'failed',
  createdAt: timestamp,
  completedAt: timestamp
}
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production M-Pesa credentials
- Configure production Firebase project
- Set up proper CORS origins
- Configure SSL certificates

## 📝 API Documentation

### Request/Response Examples

#### Register User
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "phoneNumber": "+254700000000",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "uid": "user_uid",
      "email": "user@example.com",
      "displayName": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

#### STK Push
```javascript
POST /api/mpesa/stk-push
Content-Type: application/json
Authorization: Bearer <token>

{
  "phoneNumber": "254700000000",
  "amount": 100,
  "accountReference": "Payment",
  "transactionDesc": "Test payment"
}

Response:
{
  "success": true,
  "message": "STK Push initiated successfully",
  "data": {
    "checkoutRequestId": "ws_CO_15012024143012345678",
    "merchantRequestId": "29115-34620561-1",
    "responseCode": "0",
    "responseDescription": "Success. Request accepted for processing"
  }
}
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers
- **Input Validation**: All inputs validated and sanitized
- **JWT Authentication**: Secure token-based auth
- **Firebase Security**: Rules configured for data protection

## 📈 Monitoring

### Health Check
```bash
GET /health
```

Response:
```javascript
{
  "status": "OK",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logging
- **Morgan**: HTTP request logging
- **Console**: Error and info logging
- **File**: Error logs saved to files

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   - Check Firebase project configuration
   - Verify service account credentials
   - Ensure Firebase project has Authentication enabled

2. **M-Pesa API Errors**
   - Verify Daraja API credentials
   - Check callback URLs configuration
   - Ensure proper phone number format

3. **CORS Errors**
   - Update FRONTEND_URL in environment variables
   - Check CORS configuration in server.js

4. **Port Already in Use**
   - Change PORT in environment variables
   - Kill existing processes on the port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
