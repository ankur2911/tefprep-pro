# Google & Apple Sign-In Setup Guide

## Step 1: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **tefprep-pro**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Click **Enable**
6. Add a support email (your email)
7. Click **Save**

8. **Get Web Client ID:**
   - In the Google sign-in settings, expand the "Web SDK configuration" section
   - Copy the **Web client ID** (looks like: `123456789-xxxxx.apps.googleusercontent.com`)
   - You'll need this for the `.env` file

## Step 2: Enable Apple Sign-In in Firebase

1. Still in **Authentication** → **Sign-in method**
2. Click on **Apple** provider
3. Click **Enable**
4. For now, just enable it - we'll configure the rest during iOS build

## Step 3: Add Credentials to .env File

Add these lines to your `.env` file:

```bash
# Google Sign-In Web Client ID (get from Firebase Console)
GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com

# iOS Bundle ID (for Apple Sign-In)
IOS_BUNDLE_ID=com.tefprep.pro
```

## Step 4: Configure Google Sign-In for Android

### Add SHA-1 Certificate to Firebase

1. Get your SHA-1 certificate fingerprint:
   ```bash
   eas credentials -p android
   ```

2. Go to Firebase Console → Project Settings → Your apps
3. Click on your Android app
4. Scroll to "SHA certificate fingerprints"
5. Click "Add fingerprint"
6. Paste the SHA-1 from EAS

## Step 5: Configure Apple Sign-In (iOS)

### In Apple Developer Account:

1. Go to [Apple Developer](https://developer.apple.com/account)
2. **Certificates, Identifiers & Profiles**
3. **Identifiers** → Select your App ID
4. Check **Sign In with Apple** capability
5. Click **Save**

### In Firebase (for Apple Sign-In):

1. Go to Firebase Console → Authentication → Sign-in method → Apple
2. You'll need:
   - **Services ID**: Create one in Apple Developer (e.g., `com.tefprep.pro.signin`)
   - **Private Key**: Generate in Apple Developer
   - **Key ID**: Provided when you create the key
   - **Team ID**: Found in Apple Developer account

**Note:** Apple Sign-In configuration is complex. We can complete it during iOS build setup.

## Step 6: Rebuild the App

Since we added native modules, you need to rebuild:

```bash
eas build --profile development --platform android
```

And for iOS when ready:
```bash
eas build --profile development --platform ios
```

## Testing

Once configured:
- **Google Sign-In**: Works on both Android and iOS
- **Apple Sign-In**: iOS only (not available on Android)

## Troubleshooting

### Google Sign-In Issues:
- Make sure Web Client ID is correct
- Verify SHA-1 certificate is added to Firebase
- Check that Google Sign-In is enabled in Firebase Console

### Apple Sign-In Issues:
- Only works on iOS devices (not simulators in some cases)
- Requires valid provisioning profile
- Must have "Sign In with Apple" capability enabled

## Current Status

✅ Packages installed
✅ Code implemented
⏳ Firebase configuration needed (Steps 1-3)
⏳ App rebuild needed (Step 6)
