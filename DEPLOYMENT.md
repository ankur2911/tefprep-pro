# E-Commerce App Deployment Guide

This guide explains how to deploy your React Native + Expo e-commerce app to both the Apple App Store and Google Play Store.

## Prerequisites

Before you begin, make sure you have:

1. Node.js installed (version 20.11.1 or higher recommended)
2. EAS CLI installed globally (already done: `npm install -g eas-cli`)
3. An Expo account (sign up at https://expo.dev)
4. Apple Developer Account ($99/year) for App Store
5. Google Play Developer Account ($25 one-time fee) for Play Store

## Step 1: Configure Your Expo Account

1. Login to EAS CLI:
   ```bash
   cd EcommerceApp
   eas login
   ```

2. Configure your EAS project:
   ```bash
   eas init
   ```
   This will create a project ID and update your `app.json` file.

## Step 2: Update App Configuration

Before deploying, update the following in `app.json`:

1. **App Name**: Change `"name": "EcommerceApp"` to your app's name
2. **Bundle Identifiers**:
   - iOS: `"bundleIdentifier": "com.yourcompany.ecommerceapp"` (use your own domain in reverse)
   - Android: `"package": "com.yourcompany.ecommerceapp"` (use your own domain in reverse)
3. **App Version**: Update `"version"` as needed (e.g., "1.0.1", "1.1.0")

## Step 3: Build for iOS (App Store)

### Create iOS Build

```bash
eas build --platform ios
```

Choose the build profile when prompted (use "production" for App Store release).

### Submit to App Store

1. After the build completes, download the `.ipa` file or use EAS Submit:
   ```bash
   eas submit --platform ios
   ```

2. Provide your Apple ID credentials when prompted

3. Complete App Store Connect setup:
   - Go to https://appstoreconnect.apple.com
   - Create a new app
   - Fill in app information (name, description, screenshots, etc.)
   - Set pricing and availability
   - Submit for review

### Requirements for App Store:

- **App Icons**: 1024x1024 PNG (already at `./assets/icon.png`)
- **Screenshots**: Required for all supported devices
- **Privacy Policy**: Required if you collect user data
- **App Description**: Clear description of your app
- **Keywords**: Relevant keywords for search
- **Age Rating**: Answer questionnaire in App Store Connect

## Step 4: Build for Android (Google Play Store)

### Create Android Build

```bash
eas build --platform android
```

Choose "apk" or "aab" format (Google Play requires "aab" for production).

### Submit to Google Play Store

1. After the build completes, use EAS Submit:
   ```bash
   eas submit --platform android
   ```

2. Or manually upload to Google Play Console:
   - Go to https://play.google.com/console
   - Create a new app
   - Upload the `.aab` file
   - Fill in store listing (description, screenshots, etc.)
   - Set pricing and distribution
   - Submit for review

### Requirements for Google Play Store:

- **App Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: At least 2 screenshots
- **Short Description**: Max 80 characters
- **Full Description**: Max 4000 characters
- **Privacy Policy**: Required if you collect user data
- **Content Rating**: Complete the questionnaire

## Step 5: Test Your Build

Before submitting to stores, test your app thoroughly:

### Test on iOS:

1. Create a development build:
   ```bash
   eas build --profile development --platform ios
   ```

2. Install on your device using the Expo Go app or TestFlight

### Test on Android:

1. Create a development build:
   ```bash
   eas build --profile development --platform android
   ```

2. Install the APK on your Android device

## Step 6: Update Your App

When you need to release updates:

1. Update version numbers in `app.json`:
   - Increment `"version"` (e.g., "1.0.0" → "1.0.1")
   - iOS: Increment `"buildNumber"`
   - Android: Increment `"versionCode"`

2. Rebuild and resubmit:
   ```bash
   eas build --platform ios
   eas build --platform android
   eas submit --platform ios
   eas submit --platform android
   ```

## Development Workflow

### Run Locally

```bash
# Start the development server
npm start

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Create EAS Build Profiles

Create `eas.json` in your project root for custom build configurations:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Important Notes

1. **Bundle Identifiers**: Must be unique across all apps in the stores. Use your own domain name in reverse (e.g., `com.yourcompany.appname`)

2. **Signing Credentials**: EAS will handle iOS certificates and Android keystores automatically

3. **Store Review Times**:
   - Apple App Store: Typically 1-3 days
   - Google Play Store: Typically 1-7 days

4. **App Store Guidelines**: Read and follow:
   - Apple: https://developer.apple.com/app-store/review/guidelines/
   - Google: https://play.google.com/about/developer-content-policy/

5. **Over-The-Air (OTA) Updates**: Expo allows you to push updates without going through store review for JavaScript changes:
   ```bash
   eas update
   ```

## Troubleshooting

### Build Fails

- Check your Node version: `node --version`
- Clear Expo cache: `expo start --clear`
- Check EAS build logs: `eas build:list`

### Submission Fails

- Verify bundle identifiers match your developer accounts
- Check that all required metadata is filled in
- Ensure your app icons meet size requirements

### App Rejected

- Read the rejection reason carefully
- Fix the issues mentioned
- Resubmit with explanations in the review notes

## Next Steps

1. **Analytics**: Add analytics (e.g., Google Analytics, Mixpanel)
2. **Crash Reporting**: Integrate Sentry or similar
3. **Push Notifications**: Set up Expo Push Notifications
4. **Payment Processing**: Integrate Stripe or PayPal for real payments
5. **Backend**: Connect to a real backend API (Firebase, Supabase, custom API)
6. **Authentication**: Add user authentication (email/password, social login)

## Resources

- Expo Documentation: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
