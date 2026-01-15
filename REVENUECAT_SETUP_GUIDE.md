# RevenueCat Setup Guide for TEFPrep Pro

Complete step-by-step guide to set up in-app purchases for iOS and Android.

---

## Prerequisites

- [ ] Apple Developer Account ($99/year) - https://developer.apple.com
- [ ] Google Play Developer Account ($25 one-time) - https://play.google.com/console
- [ ] Banking/Tax information set up in both accounts
- [ ] App uploaded to App Store Connect and Google Play Console (at least as draft)

---

## Step 1: Create RevenueCat Account (10 minutes)

### 1.1 Sign Up
1. Go to https://app.revenuecat.com
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your email (or use Google/GitHub)
4. Verify your email address

### 1.2 Create New Project
1. After login, click **"Create a project"**
2. Project Name: `TEFPrep Pro`
3. Select your project type: **Mobile App**
4. Click **"Create Project"**

### 1.3 Add Your Apps
1. In the RevenueCat dashboard, click **"Apps"** in the left sidebar
2. Click **"+ New"** button

#### Add iOS App:
- **App name:** TEFPrep Pro iOS
- **Bundle ID:** `com.tefprep.pro` (must match your Xcode project)
- **Platform:** iOS
- Click **"Save"**

#### Add Android App:
- Click **"+ New"** again
- **App name:** TEFPrep Pro Android
- **Package name:** `com.tefprep.pro` (must match your Android project)
- **Platform:** Android
- Click **"Save"**

### 1.4 Get Your API Keys
1. Click on **"Settings"** in the left sidebar
2. Click on **"API Keys"**
3. You'll see two keys:
   - **Apple App Store** key (starts with `appl_`)
   - **Google Play Store** key (starts with `goog_`)
4. **Copy these keys** - you'll need them later
5. **Keep them secret!** Don't share or commit to GitHub

---

## Step 2: Set Up iOS Products in App Store Connect (30 minutes)

### 2.1 Access App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click **"My Apps"**
4. Select **TEFPrep Pro** (or create it if you haven't yet)

### 2.2 Create App Record (If New App)
If your app doesn't exist yet:
1. Click **"+" → New App**
2. Fill in:
   - **Platform:** iOS
   - **Name:** TEFPrep Pro
   - **Primary Language:** English
   - **Bundle ID:** Select `com.tefprep.pro`
   - **SKU:** `tefprep-pro-001` (unique identifier)
3. Click **"Create"**

### 2.3 Set Up Subscription Group
1. In your app, go to **"Features"** tab
2. Click **"In-App Purchases"** or **"Subscriptions"**
3. Click the **"+"** button
4. Select **"Auto-Renewable Subscriptions"**
5. Create a **Subscription Group**:
   - **Reference Name:** TEFPrep Pro Premium
   - **Group Identifier:** Will be auto-generated (e.g., `group_premium`)
6. Click **"Create"**

### 2.4 Create Monthly Subscription
1. In the subscription group, click **"+"** to add a subscription
2. Fill in the details:
   - **Reference Name:** TEFPrep Pro Monthly
   - **Product ID:** `com.tefprep.pro.monthly` ⚠️ MUST BE EXACT
   - **Subscription Duration:** 1 Month

3. **Subscription Pricing:**
   - Click **"Add Pricing"**
   - **United States:** $9.99 (Base Territory)
   - Click **"Set Starting Price"**
   - RevenueCat will suggest prices for other countries
   - Review and click **"Next"**

4. **Subscription Localizations:**
   - **Subscription Display Name:** Monthly Premium Access
   - **Description:** Access to all premium TEF practice papers with monthly billing

5. **Review Information:**
   - **Promotional Image:** Optional (1024x1024px)
   - Click **"Save"**

### 2.5 Create Yearly Subscription
1. Click **"+"** again in the subscription group
2. Fill in:
   - **Reference Name:** TEFPrep Pro Yearly
   - **Product ID:** `com.tefprep.pro.yearly` ⚠️ MUST BE EXACT
   - **Subscription Duration:** 1 Year

3. **Subscription Pricing:**
   - **United States:** $99.00
   - Click **"Set Starting Price"**

4. **Subscription Localizations:**
   - **Subscription Display Name:** Yearly Premium Access
   - **Description:** Access to all premium TEF practice papers with annual billing - save $20/year!

5. Click **"Save"**

### 2.6 Submit for Review (Important!)
1. For each subscription, click on it
2. Scroll down and click **"Submit for Review"**
3. Fill in required information:
   - **Screenshot:** Provide a screenshot showing the subscription in your app
   - **Review Notes:** "This subscription unlocks premium practice papers for TEF certification preparation"
4. Click **"Submit"**

⏱️ **Review Time:** Apple typically takes 24-48 hours to review

### 2.7 Create Sandbox Test Account
While waiting for review, set up testing:
1. Go to **"Users and Access"** in App Store Connect
2. Click **"Sandbox"** tab
3. Click **"+" → Sandbox Testers**
4. Fill in:
   - **First Name:** Test
   - **Last Name:** User
   - **Email:** Create a new email (e.g., `testuser@yourdomain.com`)
   - **Password:** Strong password
   - **Country/Region:** United States
5. Click **"Create"**

📝 **Note:** This email doesn't need to exist, but remember the credentials!

---

## Step 3: Set Up Android Products in Google Play Console (30 minutes)

### 3.1 Access Google Play Console
1. Go to https://play.google.com/console
2. Sign in with your Google Play Developer account
3. Select **TEFPrep Pro** app (or create it if you haven't)

### 3.2 Create App (If New)
If your app doesn't exist yet:
1. Click **"Create app"**
2. Fill in:
   - **App name:** TEFPrep Pro
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations and click **"Create app"**

### 3.3 Set Up Subscriptions
1. In your app dashboard, go to **"Monetize"** → **"Subscriptions"**
2. If prompted, set up a merchant account:
   - Link Google Payments Profile
   - Add banking information for payouts
   - Complete tax information

### 3.4 Create Monthly Subscription
1. Click **"Create subscription"**
2. Fill in:
   - **Product ID:** `com.tefprep.pro.monthly` ⚠️ MUST BE EXACT (same as iOS)
   - **Name:** Monthly Premium Access
   - **Description:** Access to all premium TEF practice papers with monthly billing

3. **Base Plans and Offers:**
   - Click **"Add base plan"**
   - **Billing period:** 1 month (P1M)
   - **Base plan ID:** `monthly-base` (auto-suggested)
   - **Price:** $9.99 USD
   - **Auto-renewing:** Yes
   - Click **"Add"**

4. Click **"Activate"** (in top right)

### 3.5 Create Yearly Subscription
1. Click **"Create subscription"** again
2. Fill in:
   - **Product ID:** `com.tefprep.pro.yearly` ⚠️ MUST BE EXACT
   - **Name:** Yearly Premium Access
   - **Description:** Access to all premium TEF practice papers with annual billing - save $20/year!

3. **Base Plans and Offers:**
   - Click **"Add base plan"**
   - **Billing period:** 1 year (P1Y)
   - **Base plan ID:** `yearly-base`
   - **Price:** $99.00 USD
   - **Auto-renewing:** Yes
   - Click **"Add"**

4. Click **"Activate"**

### 3.6 Set Up Testing Track
1. Go to **"Testing"** → **"Internal testing"**
2. Click **"Create new release"**
3. Upload your APK/AAB (if you haven't already)
4. Click **"Save"** and **"Review release"**
5. Click **"Start rollout to Internal testing"**

### 3.7 Add Test Users
1. Still in **"Internal testing"**, scroll to **"Testers"**
2. Click **"Create email list"**
3. **List name:** TEFPrep Testers
4. Add your email address and any other testers
5. Click **"Save changes"**

### 3.8 Enable License Testing
1. Go to **"Testing"** → **"License testing"**
2. Add test accounts (Gmail addresses)
3. Select **"License response:** Licensed
4. This allows you to test purchases without being charged

---

## Step 4: Connect App Store Connect to RevenueCat (10 minutes)

### 4.1 Generate App Store Connect API Key
1. Go to https://appstoreconnect.apple.com
2. Click **"Users and Access"**
3. Click **"Keys"** tab (under Integrations)
4. Click **"+"** to generate a key
5. Fill in:
   - **Name:** RevenueCat API Key
   - **Access:** Select **"Admin"** (or "App Manager" at minimum)
6. Click **"Generate"**
7. **Download the .p8 file** immediately (you can only download once!)
8. Note the **Key ID** and **Issuer ID** shown on the page

### 4.2 Upload to RevenueCat
1. Go back to RevenueCat dashboard
2. Click **"Apps"** → Select your iOS app
3. Click **"Service credentials"**
4. In **"App Store Connect"** section:
   - **Issuer ID:** Paste from App Store Connect
   - **Key ID:** Paste from App Store Connect
   - **Private Key:** Upload the .p8 file you downloaded
5. Click **"Save"**

### 4.3 Verify Connection
1. RevenueCat will test the connection
2. You should see "✓ Connected" status
3. If there's an error, double-check your Key ID, Issuer ID, and .p8 file

---

## Step 5: Connect Google Play to RevenueCat (15 minutes)

### 5.1 Create Service Account in Google Cloud
1. Go to https://console.cloud.google.com
2. Select the project linked to your Play Console (or create one)
3. Go to **"IAM & Admin"** → **"Service Accounts"**
4. Click **"+ Create Service Account"**
5. Fill in:
   - **Service account name:** RevenueCat
   - **Service account ID:** Auto-generated
   - **Description:** RevenueCat API access
6. Click **"Create and Continue"**
7. **Role:** Skip this, click **"Continue"**
8. Click **"Done"**

### 5.2 Generate JSON Key
1. Find the service account you just created
2. Click on it
3. Go to **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"**
6. Click **"Create"**
7. A JSON file will download - **save it securely!**

### 5.3 Link Service Account to Play Console
1. Go to https://play.google.com/console
2. Go to **"Users and permissions"**
3. Click **"Invite new users"**
4. **Email address:** Paste the service account email (from the JSON file, looks like `revenucat@project-id.iam.gserviceaccount.com`)
5. **App permissions:**
   - Select your app
   - Check **"View financial data"**
   - Check **"Manage orders and subscriptions"**
6. Click **"Invite user"**
7. Click **"Send invitation"**

### 5.4 Upload to RevenueCat
1. Go back to RevenueCat dashboard
2. Click **"Apps"** → Select your Android app
3. Click **"Service credentials"**
4. In **"Google Play"** section:
   - **Service account credentials:** Upload the JSON file
5. Click **"Save"**

### 5.5 Verify Connection
1. RevenueCat will test the connection
2. You should see "✓ Connected" status

---

## Step 6: Configure RevenueCat Products and Entitlements (10 minutes)

### 6.1 Create Entitlement
1. In RevenueCat dashboard, click **"Entitlements"**
2. Click **"+ New"**
3. Fill in:
   - **Entitlement identifier:** `premium_access` ⚠️ MUST MATCH YOUR CODE
   - **Display name:** Premium Access
   - **Description:** Access to all premium TEF practice papers
4. Click **"Save"**

### 6.2 Add iOS Products
1. Click **"Products"** in left sidebar
2. Your iOS products should auto-import from App Store Connect
3. If not, click **"+ New"** and manually add:
   - **App:** TEFPrep Pro iOS
   - **Store product ID:** `com.tefprep.pro.monthly`
   - **Type:** Subscription
4. Repeat for `com.tefprep.pro.yearly`

### 6.3 Add Android Products
1. Still in **"Products"**, click **"+ New"**
2. Add Android products:
   - **App:** TEFPrep Pro Android
   - **Store product ID:** `com.tefprep.pro.monthly`
   - **Type:** Subscription
3. Repeat for `com.tefprep.pro.yearly`

### 6.4 Create Offering
1. Click **"Offerings"** in left sidebar
2. Click **"+ New"**
3. Fill in:
   - **Identifier:** `default` ⚠️ MUST BE "default" (your code expects this)
   - **Description:** Standard subscription offerings
4. Click **"Save"**

### 6.5 Add Packages to Offering
1. Click on the `default` offering you just created
2. Click **"+ Add Package"**

**Monthly Package:**
- **Identifier:** `monthly` ⚠️ MUST MATCH YOUR CODE
- **iOS Product:** Select `com.tefprep.pro.monthly`
- **Android Product:** Select `com.tefprep.pro.monthly`
- Click **"Save"**

**Yearly Package:**
- Click **"+ Add Package"** again
- **Identifier:** `yearly` ⚠️ MUST MATCH YOUR CODE
- **iOS Product:** Select `com.tefprep.pro.yearly`
- **Android Product:** Select `com.tefprep.pro.yearly`
- Click **"Save"**

### 6.6 Attach Entitlements to Products
1. Go back to **"Products"**
2. Click on `com.tefprep.pro.monthly` (iOS)
3. Click **"Attach entitlement"**
4. Select `premium_access`
5. Click **"Attach"**
6. Repeat for all 4 products (2 iOS + 2 Android)

---

## Step 7: Update Your .env File (5 minutes)

### 7.1 Get Your API Keys
From RevenueCat dashboard:
1. Click **"Settings"** → **"API Keys"**
2. Copy your **Apple App Store** key (starts with `appl_`)
3. Copy your **Google Play Store** key (starts with `goog_`)

### 7.2 Update .env File
1. Open `C:\Users\sharmaanku\EcommerceApp\.env` in your code editor
2. Replace the placeholder values:

```env
# RevenueCat API Keys
REVENUECAT_API_KEY_APPLE=appl_YOUR_ACTUAL_KEY_HERE
REVENUECAT_API_KEY_GOOGLE=goog_YOUR_ACTUAL_KEY_HERE

# Firebase Configuration (already filled in)
FIREBASE_API_KEY=AIzaSyCIZ5IsEMJKdr5Cc3QKrXhOrTkcr3nvSQc
FIREBASE_AUTH_DOMAIN=tefprep-pro.firebaseapp.com
FIREBASE_PROJECT_ID=tefprep-pro
FIREBASE_STORAGE_BUCKET=tefprep-pro.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=136999807438
FIREBASE_APP_ID=1:136999807438:web:f282a51b9736ab7cb6239f
```

3. **Save the file**
4. ⚠️ **NEVER commit this file to git** (it's already in .gitignore)

---

## Step 8: Test on iOS (30 minutes)

### 8.1 Prepare Your Test Device
1. **Sign out of App Store:**
   - Open Settings app
   - Tap your name at the top
   - Scroll down and tap **"Sign Out"**
   - Sign out completely

2. **Don't sign in yet!** Wait until the app prompts you

### 8.2 Build and Run on Device
1. Open Terminal in your project folder:
```bash
cd C:\Users\sharmaanku\EcommerceApp
npx expo run:ios --device
```

2. Select your physical iOS device
3. Wait for the build to complete and install

### 8.3 Test the Purchase Flow
1. **Open the app** on your device
2. **Sign up/Login** with a test account (not your sandbox tester email)
3. **Navigate to Subscription screen**
4. **Verify:**
   - ✓ Two subscription plans appear (Monthly $9.99, Yearly $99)
   - ✓ Prices are loaded from App Store (not hardcoded)
   - ✓ "Restore Purchases" button is visible

5. **Tap "Subscribe Now"** on Monthly plan
6. **iOS will prompt for App Store sign-in**
   - Use your **sandbox tester credentials** (from Step 2.7)
   - The purchase dialog will say "[Sandbox]" at the top
7. **Confirm purchase** (you won't be charged)
8. **Wait for success message**

### 8.4 Verify Purchase
1. After purchase, you should see:
   - ✓ Success alert: "Welcome to Premium!"
   - ✓ Premium badge in Profile screen
   - ✓ Premium papers are now unlocked (no lock icon)
   - ✓ "Current Plan" card shows your subscription

2. Check RevenueCat dashboard:
   - Go to **"Customers"**
   - Search for your test user
   - You should see the active subscription

### 8.5 Test Restore Purchases
1. **Delete the app** from your device
2. **Reinstall** the app
3. **Login** with the same account
4. **Go to Subscription screen**
5. **Tap "Restore Purchases"**
6. **Verify:**
   - ✓ Success message appears
   - ✓ Premium access is restored
   - ✓ Current Plan card shows your subscription

### 8.6 Test Subscription Management
1. **Tap "Manage Subscription"**
2. **Verify:**
   - ✓ iOS Settings → Subscriptions opens
   - ✓ Your sandbox subscription is listed
   - ✓ You can cancel from here (for testing)

---

## Step 9: Test on Android (30 minutes)

### 9.1 Build APK for Testing
1. Open Terminal in your project folder:
```bash
cd C:\Users\sharmaanku\EcommerceApp
npx expo build:android --type apk
```

2. Wait for the build (takes 10-20 minutes)
3. Download the APK when complete

### 9.2 Install on Test Device
1. Enable **Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable **"USB Debugging"**

2. Connect device to computer via USB
3. Install the APK:
```bash
adb install path/to/your-app.apk
```

### 9.3 Enroll in Internal Testing
1. On your Android device, open the email invitation from Google Play
2. Click the link to join internal testing
3. Accept the invitation
4. Install the app from Play Store (internal testing)

### 9.4 Test the Purchase Flow
1. **Open the app** on your device
2. **Sign up/Login** with a test account
3. **Navigate to Subscription screen**
4. **Verify:**
   - ✓ Two subscription plans appear
   - ✓ Prices are loaded from Play Store
   - ✓ "Restore Purchases" button is visible

5. **Tap "Subscribe Now"** on Monthly plan
6. **Google Play payment dialog appears**
   - Since you're a license tester, you won't be charged
   - The dialog will say "Test card"
7. **Complete the purchase**
8. **Wait for success message**

### 9.5 Verify Purchase
1. After purchase, verify:
   - ✓ Success alert appears
   - ✓ Premium badge in Profile
   - ✓ Premium papers unlocked
   - ✓ "Current Plan" card shows subscription

2. Check RevenueCat dashboard to see the subscription

### 9.6 Test Restore Purchases
1. **Clear app data:**
   - Settings → Apps → TEFPrep Pro
   - Tap "Storage"
   - Tap "Clear Data"
2. **Open app again**
3. **Login** with same account
4. **Tap "Restore Purchases"**
5. **Verify:** Premium access is restored

### 9.7 Test Subscription Management
1. **Tap "Manage Subscription"**
2. **Verify:**
   - ✓ Google Play subscriptions page opens
   - ✓ Your test subscription is listed
   - ✓ Can manage or cancel

---

## Step 10: Monitor and Debug (Ongoing)

### 10.1 RevenueCat Dashboard
Monitor your subscriptions:
1. **Dashboard:** Overview of revenue and subscribers
2. **Customers:** Search for specific users
3. **Charts:** View metrics over time
4. **Events:** Debug purchase events

### 10.2 Common Issues and Solutions

**Issue: "No offerings available"**
- Solution: Check that offerings are configured in RevenueCat dashboard
- Verify API keys are correct in .env file
- Check console logs for initialization errors

**Issue: "Purchase failed"**
- iOS: Ensure you're signed in with sandbox tester account
- Android: Verify you're enrolled in internal testing
- Check that products are "Ready for Sale" / "Active"

**Issue: "User not identified in RevenueCat"**
- Solution: Check that user is logged into Firebase first
- Verify RevenueCat initialization happens after login
- Check console for identification errors

**Issue: "Prices not loading"**
- Solution: Verify App Store Connect and Play Console connections in RevenueCat
- Check that products are properly imported
- Ensure offerings have both iOS and Android products attached

### 10.3 Logs to Check
- **Xcode Console** (iOS): `cmd+shift+2` while running
- **Android Logcat**: `adb logcat | grep -i revenuecat`
- **RevenueCat Dashboard:** Events tab shows all API calls

### 10.4 Testing Checklist
Before going live, test:
- [ ] New user purchase (iOS)
- [ ] New user purchase (Android)
- [ ] Restore purchases after reinstall (iOS)
- [ ] Restore purchases after reinstall (Android)
- [ ] Switch from monthly to yearly (both platforms)
- [ ] Cancel subscription and verify access until period end
- [ ] Cross-device sync (same user, different device)
- [ ] Premium content unlocks correctly
- [ ] Subscription status displays correctly in Profile

---

## Step 11: Prepare for Production Release

### 11.1 Pre-Launch Checklist
- [ ] All products approved in App Store Connect
- [ ] All products active in Google Play Console
- [ ] RevenueCat dashboard properly configured
- [ ] Testing completed on both platforms
- [ ] Privacy Policy updated to mention subscriptions
- [ ] Terms of Service include cancellation policy
- [ ] App metadata (screenshots, description) mentions subscriptions

### 11.2 Update App Store Listing
1. **App Store Connect:**
   - Update app description to mention Premium features
   - Add screenshots showing subscription screen
   - Update keywords: "subscription", "premium", "unlock"

2. **Google Play Console:**
   - Update app description
   - Add screenshots
   - Update feature graphic

### 11.3 Set Up Webhooks (Optional but Recommended)
1. In RevenueCat dashboard, go to **"Integrations"**
2. Add webhook URL (if you have a backend)
3. Select events: purchase, renewal, cancellation
4. This syncs subscription status to your backend

### 11.4 Monitor After Launch
First 48 hours after launch:
- Check RevenueCat dashboard hourly
- Monitor for failed purchases
- Respond to user support tickets quickly
- Watch for Apple/Google review issues

### 11.5 Going Live
1. **iOS:** Submit new version with in-app purchases
2. **Android:** Promote from internal testing to production
3. **Monitor:** Watch for purchase failures or bugs
4. **Support:** Be ready to help users with subscription issues

---

## Troubleshooting Reference

### iOS Specific Issues

**"Cannot connect to iTunes Store"**
- Solution: Sign out of App Store completely and sign back in with sandbox account
- Restart device
- Check internet connection

**"Purchase is not available"**
- Products not approved yet - wait for Apple review
- Products not in "Ready for Sale" status
- Bundle ID mismatch - verify in Xcode and App Store Connect

**Sandbox account issues**
- Solution: Create a new sandbox tester
- Make sure using the sandbox email, not your real Apple ID
- Try on a different device

### Android Specific Issues

**"Item unavailable in your country"**
- Solution: Product not active yet
- Not enrolled in internal testing
- Need to publish to testing track first

**"Authentication required"**
- Solution: Sign in to Google Play Store
- Accept license testing enrollment
- Clear Play Store cache

**"You already own this item"**
- Solution: Test purchases can't be repurchased immediately
- Use "Revoke purchases" in Play Console
- Use different test account

### RevenueCat Issues

**"Invalid API Key"**
- Solution: Double-check keys in .env file
- Regenerate keys in RevenueCat dashboard
- Restart app after updating .env

**"No customer info found"**
- Solution: User not identified yet
- Check that login flow calls `identifyUser()`
- Verify user is logged into Firebase

---

## Support Resources

### Documentation
- **RevenueCat Docs:** https://docs.revenuecat.com
- **React Native Integration:** https://docs.revenuecat.com/docs/reactnative
- **App Store Connect Guide:** https://developer.apple.com/app-store-connect/
- **Google Play Console Help:** https://support.google.com/googleplay/android-developer

### Community
- **RevenueCat Community:** https://community.revenuecat.com
- **RevenueCat Discord:** Available through their website
- **Stack Overflow:** Tag: `revenuecat`

### Direct Support
- **RevenueCat Support:** support@revenuecat.com
- **Apple Developer Support:** https://developer.apple.com/contact/
- **Google Play Support:** Through Play Console

---

## Next Steps After Going Live

1. **Week 1:** Monitor daily, fix critical issues immediately
2. **Month 1:** Analyze conversion rates, A/B test pricing display
3. **Month 2:** Add promotional offers, implement win-back campaigns
4. **Ongoing:** Track churn, optimize subscription funnels

---

## Congratulations! 🎉

You've successfully set up in-app purchases for TEFPrep Pro. Your app is now ready to accept real payments from users on both iOS and Android!

Remember:
- Monitor RevenueCat dashboard regularly
- Respond to subscription issues quickly
- Keep testing on both platforms
- Update products/pricing as needed

Good luck with your app launch! 🚀
