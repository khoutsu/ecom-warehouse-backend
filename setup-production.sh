#!/bin/bash

# Firebase Production Setup Script
# This script helps you configure Firebase for production use

echo "🔥 Firebase Production Setup for Ecom Warehouse"
echo "================================================"

echo ""
echo "📋 STEP 1: Update Firestore Security Rules"
echo "1. Go to: https://console.firebase.google.com"
echo "2. Select project: ecomandwarehouse"
echo "3. Go to: Firestore Database > Rules"
echo "4. Replace with rules from: firestore-rules.txt"
echo "5. Click 'Publish'"

echo ""
echo "📋 STEP 2: Update Firebase Storage Rules"
echo "1. In Firebase Console, go to: Storage > Rules"
echo "2. Replace with rules from: firebase-storage-rules.txt"
echo "3. Click 'Publish'"

echo ""
echo "📋 STEP 3: Configure CORS (if needed)"
echo "If you still get CORS errors, run these commands:"
echo ""
echo "# Install Google Cloud SDK first:"
echo "# https://cloud.google.com/sdk/docs/install"
echo ""
echo "# Then run:"
echo "gsutil cors set cors.json gs://ecomandwarehouse.appspot.com"

echo ""
echo "📋 STEP 4: Test Firebase Storage"
echo "1. Start your app: npm run dev"
echo "2. Try uploading an image"
echo "3. Check if image appears in Firebase Storage Console"

echo ""
echo "✅ Production Features Enabled:"
echo "- Real Firebase Storage uploads"
echo "- Proper file management"
echo "- Image compression and optimization"
echo "- Secure file deletion"
echo "- No more base64/mock data"

echo ""
echo "🚨 IMPORTANT:"
echo "Make sure to update Firebase rules before testing!"
echo "Without proper rules, uploads will fail with permission errors."
