# Firebase Authentication & Database Setup Guide

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ecom-warehouse` (or your preferred name)
4. **Disable Google Analytics** (unless you need it)
5. Click "Create project"

## 🔐 Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

## 🌐 Step 3: Create Web App

1. In Firebase project overview, click the **"Web"** icon `</>`
2. Register your app:
   - App nickname: `E-commerce Warehouse Frontend`
   - **Check** "Also set up Firebase Hosting" (optional)
   - Click **"Register app"**
3. **Copy the Firebase configuration** - you'll need this!

```javascript
// Your Firebase config will look like this:
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## 🔑 Step 4: Create Service Account (for Backend)

1. Go to **Project Settings** (gear icon) → **"Service accounts"**
2. Click **"Generate new private key"**
3. Click **"Generate key"** - downloads a JSON file
4. **Keep this file secure!** Never commit to version control

## ⚙️ Step 5: Set Up Environment Variables

### Frontend (.env.local)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Backend (.env)
Create `backend/.env` from the service account JSON:
```env
NODE_ENV=development
PORT=5000

# From your service account JSON file
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=private-key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=client-id-from-json

# Standard Firebase URLs
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Step 6: Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a **location** (choose closest to your users)
5. Click **"Done"**

## 🛡️ Step 7: Configure Firestore Security Rules

In Firestore → **"Rules"** tab, update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products - public read, authenticated write
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Inventory - authenticated users only
    match /inventory/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Orders - users can only access their own orders
    match /orders/{document} {
      allow read, write: if request.auth != null && 
                             request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🚀 Step 8: Install Dependencies & Start

### Frontend:
```bash
cd frontend
npm install firebase
npm run dev
```

### Backend:
```bash
cd backend
npm install
npm run dev
```

## ✅ Step 9: Test Authentication

1. Go to `http://localhost:3000`
2. You'll be redirected to register page
3. Create an account with email/password
4. Check Firebase Console → Authentication → Users to see the new user

## 🔧 What Firebase Handles For You

### ✅ **Authentication:**
- User registration with email/password
- Secure login/logout
- Password reset emails
- Email verification
- Session management
- Security against common attacks

### ✅ **Database:**
- Real-time data synchronization
- Offline support
- Automatic scaling
- Built-in security rules
- Multi-platform SDKs

### ✅ **Security:**
- Encrypted data transmission
- Secure authentication tokens
- Built-in CSRF protection
- Rate limiting
- DDoS protection

## 🚨 Important Security Notes

1. **Never commit** service account JSON files
2. **Use environment variables** for all sensitive data
3. **Set up proper Firestore rules** before production
4. **Enable email verification** for production
5. **Consider multi-factor authentication** for admin accounts

## 🎯 Next Steps

1. Set up your Firebase project ✅
2. Configure authentication ✅
3. Test registration/login ✅
4. Implement user roles (admin vs regular user)
5. Add password reset functionality
6. Set up email verification
7. Configure production security rules
