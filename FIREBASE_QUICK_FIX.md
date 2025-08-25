# Quick Firebase Setup Guide

## 🚨 URGENT: Fix Firestore Rules

The error you're seeing is likely because Firestore has default security rules that block all access. You need to update your Firestore rules.

### Step 1: Update Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ecomandwarehouse`
3. Click **"Firestore Database"** in left sidebar
4. Click the **"Rules"** tab
5. Replace the existing rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all authenticated users to read/write inventory
    match /inventory/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow all authenticated users to read/write test documents
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow users to access their own user documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // TEMPORARY: For testing only - remove after fixing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Click **"Publish"** to save

### Step 2: Update Storage Rules

1. Go to **"Storage"** in left sidebar
2. Click the **"Rules"** tab
3. Replace with this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    // TEMPORARY: For testing
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click **"Publish"**

### Step 3: Test the Connection

1. Restart your development server: `npm run dev`
2. Go to the inventory page
3. Click the **"🧪 Test Firebase"** button
4. Check browser console for detailed debug output

### Step 4: Enable Authentication

Make sure these are enabled in Firebase Console:
- **Authentication** → **Sign-in method** → **Email/Password** (Enable)
- **Firestore Database** (Create in test mode)
- **Storage** (Set up with test rules)

### Common Issues:

**If you see "permission-denied":**
- Check Firestore rules are published
- Make sure you're logged in as admin
- Verify Authentication is enabled

**If you see "network error":**
- Check your internet connection
- Verify Firebase project ID is correct
- Make sure all services are enabled

**If still having issues:**
- Check browser console for detailed error messages
- Try the "🧪 Test Firebase" button for diagnostics
