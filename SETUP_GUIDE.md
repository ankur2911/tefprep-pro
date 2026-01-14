# TEFPrep Pro - Complete Setup Guide

Welcome to TEFPrep Pro! This guide will help you set up your French certification prep app with Firebase backend, subscription payments, and deploy it to the App Store and Google Play Store.

## What's Been Built

✅ **Complete App Structure:**
- Modern minimal UI design with professional purple/blue color scheme
- 10+ screens including authentication, tests, results, and profile
- MCQ test-taking interface with timer and auto-scoring
- Detailed results with question review and explanations
- User authentication (Email/Password)
- Subscription management context
- Progress tracking
- Firebase integration setup

✅ **Core Features:**
- Browse TEF practice papers by category
- In-app MCQ tests with real-time scoring
- Subscription-based access (free + premium content)
- User profiles and progress tracking
- Clean, educational-focused design

✅ **Technical Stack:**
- React Native + Expo
- TypeScript
- Firebase (Auth + Firestore)
- React Navigation
- Context API for state management

## Setup Steps

### 1. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "TEFPrep Pro" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Get Firebase Configuration

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Register app with nickname "TEFPrep Pro Web"
5. Copy the `firebaseConfig` object

#### Update Firebase Config

Open `src/config/firebase.ts` and replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

#### Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. (Optional) Enable "Google" sign-in for social auth

#### Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to your users
5. Click "Enable"

#### Create Firestore Collections

Create these collections manually or they'll be created when you add data:

**Collection: `papers`**
```
Document ID: auto-generated
Fields:
  - title: string
  - description: string
  - category: string
  - difficulty: string
  - duration: number
  - questionsCount: number
  - thumbnail: string
  - isPremium: boolean
  - questions: array of maps
```

**Collection: `subscriptions`**
```
Document ID: user UID
Fields:
  - userId: string
  - status: string ('active', 'canceled', 'expired')
  - plan: string ('monthly', 'yearly')
  - startDate: timestamp
  - endDate: timestamp
  - autoRenew: boolean
```

**Collection: `test_attempts`**
```
Document ID: auto-generated
Fields:
  - paperId: string
  - userId: string
  - score: number
  - totalQuestions: number
  - answers: map
  - completedAt: timestamp
  - timeSpent: number
```

#### Firestore Security Rules

Go to Firestore → Rules and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all papers
    match /papers/{paperId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Users can only read their own subscription
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

### 2. Stripe Setup for Subscriptions

#### Create Stripe Account

1. Go to [Stripe](https://stripe.com)
2. Sign up for an account
3. Complete verification

#### Get API Keys

1. In Stripe Dashboard, go to "Developers" → "API keys"
2. Copy your "Publishable key" and "Secret key"
3. Create `.env` file in project root:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### Create Subscription Products

1. In Stripe Dashboard, go to "Products"
2. Click "Add product"
3. Create two products:

**Monthly Subscription:**
- Name: TEFPrep Pro Monthly
- Price: $9.99/month (or your price)
- Billing period: Monthly
- Copy the Price ID

**Yearly Subscription:**
- Name: TEFPrep Pro Yearly
- Price: $99/year (or your price)
- Billing period: Yearly
- Copy the Price ID

#### Install Stripe Dependencies

```bash
cd EcommerceApp
npm install @stripe/stripe-react-native
```

### 3. Add Content to Your App

#### Add Practice Papers

You can either:

**Option A: Use Firebase Console**
1. Go to Firestore Database
2. Add documents to `papers` collection manually

**Option B: Create Admin Panel**
I've created an admin panel structure - you'll need to:
1. Add papers through the admin interface
2. Upload questions for each paper
3. Set premium status

#### Sample Paper Structure

```json
{
  "title": "TEF Compréhension Orale - Niveau B1",
  "description": "Test your listening comprehension...",
  "category": "Compréhension Orale",
  "difficulty": "Intermediate",
  "duration": 45,
  "questionsCount": 30,
  "thumbnail": "https://...",
  "isPremium": true,
  "questions": [
    {
      "id": "q1",
      "question": "Quelle est la capitale de la France?",
      "options": ["Paris", "Lyon", "Marseille", "Toulouse"],
      "correctAnswer": 0,
      "explanation": "Paris est la capitale de la France."
    }
  ]
}
```

### 4. Update App Branding

#### App Icons and Splash Screen

1. Create your app icon (1024x1024 PNG)
2. Create splash screen (1284x2778 PNG)
3. Replace these files in `assets/` folder:
   - `icon.png`
   - `splash-icon.png`
   - `adaptive-icon.png` (Android)

You can use free tools like:
- [Canva](https://canva.com) for design
- [App Icon Generator](https://appicon.co) for generating all sizes

#### Colors

Already configured in `src/utils/colors.ts`:
- Primary: #5B21B6 (Purple)
- Secondary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Error: #EF4444 (Red)

Change these if you want different branding.

### 5. Test the App

```bash
cd EcommerceApp
npm start
```

Then:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### 6. Build for Production

#### Initialize EAS

```bash
eas login
eas init
```

This will create/update your `projectId` in `app.json`.

#### Configure Bundle Identifiers

In `app.json`, these are already set:
- iOS: `com.tefprep.pro`
- Android: `com.tefprep.pro`

You can change these if you own a different domain.

#### Build for iOS

```bash
eas build --platform ios --profile production
```

#### Build for Android

```bash
eas build --platform android --profile production
```

### 7. Submit to App Stores

#### App Store (iOS)

1. Create app in [App Store Connect](https://appstoreconnect.apple.com)
2. Fill in app information:
   - **Name:** TEFPrep Pro
   - **Subtitle:** Master Your French Certification
   - **Description:** (see below)
   - **Keywords:** TEF, French, certification, exam prep, language learning
   - **Category:** Education
   - **Price:** Free (with in-app purchases)

3. Upload screenshots (required sizes):
   - 6.5" iPhone: 1284 x 2778 pixels
   - 5.5" iPhone: 1242 x 2208 pixels
   - iPad Pro: 2048 x 2732 pixels

4. Submit for review:
```bash
eas submit --platform ios
```

#### Google Play Store (Android)

1. Create app in [Google Play Console](https://play.google.com/console)
2. Fill in store listing:
   - **App name:** TEFPrep Pro
   - **Short description:** Master your TEF French certification
   - **Full description:** (see below)
   - **Category:** Education
   - **Price:** Free

3. Upload assets:
   - Icon: 512 x 512 pixels
   - Feature graphic: 1024 x 500 pixels
   - Screenshots: At least 2

4. Submit for review:
```bash
eas submit --platform android
```

### Sample App Description

```
TEFPrep Pro - Your Complete TEF Certification Companion

Prepare for your Test d'Évaluation de Français (TEF) with confidence! TEFPrep Pro offers comprehensive practice tests and study materials to help you master the French language certification.

FEATURES:
✓ Authentic TEF practice papers
✓ Interactive MCQ tests with instant scoring
✓ Detailed explanations for every question
✓ Progress tracking and performance analytics
✓ Covers all TEF sections:
  • Compréhension Orale
  • Expression Écrite
  • Compréhension Écrite
  • Expression Orale
  • Vocabulaire et Grammaire

DIFFICULTY LEVELS:
• Beginner (A1-A2)
• Intermediate (B1-B2)
• Advanced (C1-C2)

SUBSCRIPTION BENEFITS:
• Access to all premium practice papers
• Unlimited test attempts
• Detailed performance analytics
• New content added regularly

Whether you're preparing for immigration, university admission, or professional certification, TEFPrep Pro gives you the tools to succeed.

Start your French certification journey today!
```

## Troubleshooting

### Firebase Not Connecting

- Check that you've replaced ALL placeholder values in `firebase.ts`
- Ensure Firebase project is created and app is registered
- Check that Authentication and Firestore are enabled

### Build Fails

- Run `npm install` to ensure all dependencies are installed
- Clear cache: `expo start --clear`
- Check Node version: `node --version` (should be 20.x)

### App Rejected from Store

Common reasons:
- Missing privacy policy (required if you collect user data)
- Incomplete metadata (description, screenshots)
- Crashes on launch (test thoroughly first)

## Next Steps

1. **Add More Content:** Create comprehensive practice papers
2. **Marketing:** Create landing page, social media presence
3. **Analytics:** Add Google Analytics or Mixpanel
4. **Crash Reporting:** Integrate Sentry
5. **Push Notifications:** Set up Expo Notifications
6. **Monetization:** Implement Stripe subscriptions
7. **Social Features:** Add leaderboards, sharing
8. **Offline Mode:** Enable offline test-taking

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review Expo build logs: `eas build:list`
3. Test on multiple devices
4. Check device logs for crashes

## Cost Breakdown

- **Firebase:** Free tier (Spark) includes:
  - 50K reads/day
  - 20K writes/day
  - 10K authentications/month

- **Stripe:** 2.9% + 30¢ per successful transaction

- **Expo EAS:**
  - Free: 30 builds/month
  - Production: $29/month (unlimited builds)

- **Apple Developer:** $99/year

- **Google Play:** $25 one-time

## Ready to Launch!

Your TEFPrep Pro app is now ready! Follow these steps in order, test thoroughly, and you'll have a professional education app in both app stores.

Good luck with your launch! 🚀
