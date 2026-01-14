# Firebase Setup Walkthrough for TEFPrep Pro

This is a complete, step-by-step guide to set up Firebase for your TEFPrep Pro app. Follow each step carefully.

## Prerequisites

- A Google account
- Your TEFPrep Pro project open in your code editor

## Step 1: Create Firebase Project (5 minutes)

### 1.1 Go to Firebase Console

1. Open your browser and go to: **https://console.firebase.google.com/**
2. Click **"Add project"** or **"Create a project"**

### 1.2 Configure Your Project

**Screen 1 - Project Name:**
- Enter project name: `TEFPrep Pro` (or your preferred name)
- Project ID will be auto-generated (e.g., `tefprep-pro-a1b2c`)
- Click **Continue**

**Screen 2 - Google Analytics:**
- Toggle OFF "Enable Google Analytics" (not needed for now)
- Click **Create project**

**Screen 3 - Wait:**
- Firebase will create your project (takes 30-60 seconds)
- Click **Continue** when ready

## Step 2: Register Your App (3 minutes)

### 2.1 Add Web App

1. On the Firebase Console homepage, you'll see: "Get started by adding Firebase to your app"
2. Click the **Web icon** (looks like `</>`)
3. Register your app:
   - **App nickname:** `TEFPrep Pro Web`
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click **Register app**

### 2.2 Copy Firebase Configuration

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tefprep-pro-a1b2c.firebaseapp.com",
  projectId: "tefprep-pro-a1b2c",
  storageBucket: "tefprep-pro-a1b2c.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**IMPORTANT:** Keep this tab open or copy this somewhere safe!

Click **Continue to console**

## Step 3: Enable Authentication (3 minutes)

### 3.1 Navigate to Authentication

1. In the left sidebar, click **"Build"** to expand
2. Click **"Authentication"**
3. Click **"Get started"** button

### 3.2 Enable Email/Password Sign-In

1. Click the **"Sign-in method"** tab at the top
2. You'll see a list of providers
3. Click on **"Email/Password"**
4. Toggle **"Enable"** to ON (blue)
5. Click **"Save"**

### 3.3 (Optional) Enable Google Sign-In

1. Click on **"Google"** in the provider list
2. Toggle **"Enable"** to ON
3. Select your **Project support email** from dropdown
4. Click **"Save"**

## Step 4: Create Firestore Database (5 minutes)

### 4.1 Navigate to Firestore

1. In the left sidebar, click **"Build"**
2. Click **"Firestore Database"**
3. Click **"Create database"** button

### 4.2 Configure Security Mode

1. Select **"Start in production mode"** (we'll add rules later)
2. Click **"Next"**

### 4.3 Choose Location

1. Select a location closest to your users:
   - **US:** `us-central1` or `us-east1`
   - **Europe:** `europe-west1`
   - **Asia:** `asia-southeast1`
2. Click **"Enable"**
3. Wait 30-60 seconds for database creation

### 4.4 Create Collections

Firebase will show an empty database. Let's create our collections:

**Create "papers" collection:**
1. Click **"Start collection"**
2. Collection ID: `papers`
3. Click **"Next"**
4. For the first document (required):
   - Document ID: Click **"Auto-ID"**
   - Add fields:
     - `title` (string): "Sample TEF Paper"
     - `description` (string): "This is a sample paper"
     - `category` (string): "Compréhension Orale"
     - `difficulty` (string): "Beginner"
     - `duration` (number): 30
     - `questionsCount` (number): 25
     - `thumbnail` (string): "https://via.placeholder.com/400x250"
     - `isPremium` (boolean): false
5. Click **"Save"**

**Create "subscriptions" collection:**
1. Click **"Start collection"** again
2. Collection ID: `subscriptions`
3. Click **"Next"**
4. Skip adding a document for now (click **"Cancel"**)

**Create "test_attempts" collection:**
1. Click **"Start collection"** again
2. Collection ID: `test_attempts`
3. Click **"Next"**
4. Skip adding a document (click **"Cancel"**)

## Step 5: Set Up Security Rules (2 minutes)

### 5.1 Navigate to Rules Tab

1. Still in **Firestore Database**
2. Click the **"Rules"** tab at the top
3. You'll see the default rules

### 5.2 Update Rules

Replace ALL the existing rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all papers
    match /papers/{paperId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Users can read their own subscriptions
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read/write their own test attempts
    match /test_attempts/{attemptId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5.3 Publish Rules

1. Click **"Publish"** button at the top
2. Confirm if prompted

## Step 6: Update Your App Configuration (3 minutes)

### 6.1 Open Your Project

1. Open your TEFPrep Pro project in your code editor
2. Navigate to: `src/config/firebase.ts`

### 6.2 Replace Configuration

You'll see placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Replace** with the configuration you copied in Step 2.2:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // Your actual API key
  authDomain: "tefprep-pro-a1b2c.firebaseapp.com",  // Your actual domain
  projectId: "tefprep-pro-a1b2c",  // Your actual project ID
  storageBucket: "tefprep-pro-a1b2c.appspot.com",  // Your actual storage
  messagingSenderId: "123456789012",  // Your actual sender ID
  appId: "1:123456789012:web:abc123def456"  // Your actual app ID
};
```

### 6.3 Save the File

- Save `firebase.ts` (Ctrl+S or Cmd+S)

## Step 7: Test Your Setup (5 minutes)

### 7.1 Start Your App

Open terminal in your project folder:

```bash
cd EcommerceApp
npm start
```

### 7.2 Test on Device

1. Scan the QR code with Expo Go app
2. Or press `w` to open in web browser

### 7.3 Try These Actions

**Test Authentication:**
1. Tap "Profile" or "Login"
2. Create a new account with email/password
3. You should see success message

**Verify in Firebase Console:**
1. Go back to Firebase Console
2. Click **"Authentication"** in sidebar
3. Click **"Users"** tab
4. You should see your newly created user!

**Test Papers:**
1. Browse papers in the app
2. Papers should load (either from Firebase or mock data)

## Step 8: Add More Content (Optional)

### 8.1 Use Admin Panel

Once your app is running:
1. Login to your app
2. Navigate to admin section (you'll need to add admin access)
3. Use "Add Paper" to create new practice papers

### 8.2 Or Add Manually in Console

1. Go to Firebase Console
2. Navigate to **Firestore Database**
3. Click on **"papers"** collection
4. Click **"Add document"**
5. Fill in all the fields (title, description, category, etc.)
6. Click **"Save"**

## Troubleshooting

### Issue: "Firebase not initialized" Error

**Solution:**
- Double-check that you replaced ALL placeholders in `firebase.ts`
- Make sure there are no typos in your config
- Restart your development server (`npm start`)

### Issue: "Permission denied" Error

**Solution:**
- Go to Firestore Rules in Firebase Console
- Make sure you published the rules from Step 5
- Check that the rules match exactly

### Issue: "Can't create user" Error

**Solution:**
- Go to Authentication in Firebase Console
- Make sure Email/Password provider is enabled
- Check that toggle is ON (blue)

### Issue: Papers Don't Load

**Solution:**
- App will use mock data if Firebase is empty or not configured
- This is normal! The app has fallback data
- Add papers through admin panel or Firebase Console

## What's Next?

✅ Your Firebase backend is now set up!

### Next Steps:

1. **Add Content:**
   - Use the admin panel to add practice papers
   - Add questions to each paper
   - Set premium status

2. **Set Up Stripe:**
   - Follow `SETUP_GUIDE.md` for payment integration
   - Create subscription products
   - Add payment UI

3. **Test Thoroughly:**
   - Create test accounts
   - Take practice tests
   - Check that data saves correctly

4. **Deploy:**
   - Build for iOS and Android
   - Submit to app stores

## Need Help?

### Firebase Documentation
- https://firebase.google.com/docs

### Common Issues
- Authentication: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore

### TEFPrep Pro Support
- Check `SETUP_GUIDE.md` for more details
- Review `README.md` for project structure

## Security Checklist

Before launching:
- [ ] Review Firestore security rules
- [ ] Test that users can only access their own data
- [ ] Ensure admin functions are protected
- [ ] Add admin role checking
- [ ] Enable app check for production
- [ ] Set up billing alerts in Google Cloud

## Summary

You should now have:
- ✅ Firebase project created
- ✅ Web app registered with Firebase config
- ✅ Authentication enabled (Email/Password)
- ✅ Firestore database created
- ✅ Collections set up (papers, subscriptions, test_attempts)
- ✅ Security rules configured
- ✅ App connected to Firebase
- ✅ Tested and working!

**Total Setup Time:** ~25 minutes

Your TEFPrep Pro app is now powered by Firebase! 🎉🔥
