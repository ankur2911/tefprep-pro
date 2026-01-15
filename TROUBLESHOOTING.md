# RevenueCat Troubleshooting Guide

Quick solutions to common issues you might encounter.

---

## App Won't Build

### Error: "Module not found: react-native-purchases"
**Solution:**
```bash
cd C:\Users\sharmaanku\EcommerceApp
npm install
npx expo prebuild --clean
```

### Error: "Could not resolve @env"
**Solution:**
1. Make sure `.env` file exists in project root
2. Restart Metro bundler:
```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

### Error: "Expo Go doesn't support this module"
**Solution:** RevenueCat requires a development build, not Expo Go
```bash
# Build for iOS
npx expo run:ios

# Build for Android
npx expo run:android
```

---

## iOS Purchase Issues

### "Cannot connect to iTunes Store"
**Solutions:**
1. Sign out of App Store completely:
   - Settings → [Your Name] → Sign Out
   - Restart iPhone
   - Open app, it will prompt for sandbox login

2. Check internet connection (sandbox requires internet)

3. Verify region settings match sandbox account:
   - Settings → General → Language & Region
   - Set to United States if testing with US sandbox account

### "This In-App Purchase has already been bought"
**Solutions:**
1. Subscriptions can't be repurchased in sandbox immediately
2. Wait 5 minutes and try again
3. Create a new sandbox test account
4. Or cancel the subscription:
   - Settings → [Your Name] → Subscriptions
   - Select TEFPrep Pro
   - Cancel Subscription

### "Product not available for purchase"
**Reasons & Solutions:**

**Products not approved:**
- Check App Store Connect → In-App Purchases
- Status should be "Ready for Sale" (not "Waiting for Review")
- Wait 24-48 hours after submission

**Bundle ID mismatch:**
- Xcode project bundle ID must be exactly `com.tefprep.pro`
- Check: Xcode → Target → Signing & Capabilities

**Missing agreements:**
- App Store Connect → Agreements, Tax, and Banking
- All must be "Active"

### "Invalid Product ID"
**Solutions:**
1. Product IDs in RevenueCat dashboard MUST exactly match:
   - `com.tefprep.pro.monthly`
   - `com.tefprep.pro.yearly`

2. Check for typos, extra spaces, or wrong casing

3. Verify products are in offerings:
   - RevenueCat → Offerings → default
   - Both packages should be there

### "User cancelled the request"
**This is normal!** User tapped "Cancel" in the purchase dialog. No action needed.

---

## Android Purchase Issues

### "Item not available in your country"
**Solutions:**
1. Make sure you're enrolled in internal testing:
   - Check email invitation from Google Play
   - Accept invitation and install from Play Store link

2. Verify products are "Active":
   - Play Console → Monetize → Subscriptions
   - Status should be green "Active"

3. Check country availability:
   - Product pricing should include your test device's country

### "You already own this item"
**Solutions:**
1. Test purchases don't expire immediately in Play Store
2. Revoke the purchase:
   - Play Console → Order Management
   - Find the test order
   - Click "Revoke"

3. Or use a different test account

4. Or clear Play Store cache:
   - Settings → Apps → Google Play Store
   - Clear Cache and Data

### "Authentication required"
**Solutions:**
1. Sign in to Google Play Store
2. Open Play Store → Settings → Make sure you're signed in
3. Accept any pending terms of service

### "DF-DFERH-01 error"
**Solutions:**
1. Clear Google Play Store cache:
   - Settings → Apps → Google Play Store → Storage → Clear Cache

2. Remove and re-add Google account:
   - Settings → Accounts → Google → Remove Account
   - Restart device
   - Add account back

3. Update Play Store to latest version

### "App not installed from Play Store"
**Solution:** For internal testing, MUST install from Play Store link:
1. Open the email invitation
2. Click "View in Play Store"
3. Install from there (not from APK)

---

## RevenueCat Integration Issues

### "No offerings available" / Loading Plans Forever
**Diagnostic Steps:**
1. Check console logs (Xcode/Android Studio)
2. Look for initialization errors

**Solutions:**

**API keys incorrect:**
```bash
# Verify .env file has real keys
cat .env
# Should show: appl_... and goog_...
```

**Wrong API key format:**
- iOS key must start with `appl_`
- Android key must start with `goog_`
- No quotes, no spaces, no extra characters

**Offerings not configured:**
- RevenueCat Dashboard → Offerings
- Must have `default` offering
- Must have `monthly` and `yearly` packages
- Each package must have both iOS and Android products

**App Store/Play Store not connected:**
- RevenueCat Dashboard → Apps → Service Credentials
- Check for "✓ Connected" status
- If red X, re-upload credentials

### "User not identified" / "Anonymous user"
**Solution:**
The app must identify users AFTER Firebase login.

Check `src/context/AuthContext.tsx`:
```typescript
// Should be called in signIn and signUp functions
await revenueCatService.identifyUser(userCredential.user.uid);
```

If missing, rebuild the app.

### "CustomerInfo not found"
**Solutions:**
1. User must be logged into Firebase first
2. RevenueCat initialization must complete before fetching customer info
3. Check network connection

**Debug:**
```javascript
// Add to SubscriptionContext.tsx temporarily
console.log('User:', user?.uid);
console.log('Customer Info:', customerInfo);
```

### "Entitlement not active after purchase"
**Solutions:**
1. Verify entitlement is attached to products:
   - RevenueCat → Products → Each product → Entitlements tab
   - `premium_access` should be listed

2. Check product IDs match exactly:
   - Store products: `com.tefprep.pro.monthly`
   - RevenueCat products: Must match exactly

3. Wait 10-30 seconds after purchase (syncing delay)

4. Force refresh:
   - App code already calls `refreshSubscription()` after purchase
   - If not working, check logs for errors

---

## Console/Dashboard Issues

### RevenueCat Dashboard Shows No Purchases
**Reasons:**
1. Using wrong account - make sure logged into correct RevenueCat project
2. Purchases happened in different app (iOS vs Android)
3. Check "All Apps" filter in dashboard

**Solution:** Search by user email or Firebase UID in Customers tab

### Dashboard Shows "No connection" for App Store/Play Store
**Solutions:**

**iOS - App Store Connect:**
1. API key expired - generate new one
2. Key permissions insufficient - needs "Admin" or "App Manager"
3. Re-upload .p8 file with correct Key ID and Issuer ID

**Android - Google Play:**
1. Service account not linked properly
2. Service account needs these permissions:
   - View financial data
   - Manage orders and subscriptions
3. JSON file might be corrupted - re-download and re-upload

### Products Not Importing to RevenueCat
**Solutions:**
1. Wait 10-15 minutes after creating products (takes time to sync)
2. Manually add products:
   - RevenueCat → Products → + New
   - Enter product ID exactly as in store

3. Verify store credentials are connected (see above)

---

## Testing Issues

### Sandbox Tester Account Not Working (iOS)
**Solutions:**
1. Create a completely new sandbox account:
   - App Store Connect → Users and Access → Sandbox Testers
   - Use a different email address

2. Make sure NOT using your real Apple ID
   - Sandbox accounts are separate from real accounts
   - Must be the fake email created in App Store Connect

3. Sign out everywhere:
   - Settings → [Name] → Sign Out
   - Restart device
   - Let app prompt you to sign in

### Can't Test on Android Emulator
**Issue:** Google Play Billing doesn't work in emulators

**Solution:** Must use a real physical Android device for testing

### Test Purchases Appear in Production Analytics
**This is normal!** Test purchases are marked as such in RevenueCat:
- Dashboard shows "Sandbox" badge
- Can filter: Dashboard → Filter → Environment → Sandbox

---

## Code Issues

### TypeScript Error: "Cannot find module '@env'"
**Solution:**
1. Check `src/types/env.d.ts` exists
2. Restart TypeScript server:
   - VS Code: Cmd+Shift+P → "Restart TS Server"
3. Restart IDE completely

### "PurchasesPackage is not exported"
**Solution:**
Update import in SubscriptionScreen.tsx:
```typescript
import { PurchasesPackage } from 'react-native-purchases';
```

### "Property 'offerings' does not exist"
**Solution:**
Make sure SubscriptionContext exports offerings:
```typescript
// In SubscriptionContext.tsx
return (
  <SubscriptionContext.Provider
    value={{
      subscription,
      loading,
      hasActiveSubscription,
      canAccessPaper,
      refreshSubscription,
      offerings, // ← Must be included
    }}
  >
```

---

## Premium Content Not Unlocking

### Premium Papers Still Show Lock Icon
**Diagnostic:**
1. Check Profile screen - does it show "Premium Member"?
2. Check subscription status:
```javascript
// Add temporary log in PaperDetailScreen.tsx
console.log('Has subscription:', hasActiveSubscription);
console.log('Paper is premium:', paper.isPremium);
console.log('Has access:', hasAccess);
```

**Solutions:**

**Subscription not syncing:**
- Force refresh: Pull down on Profile screen
- Check SubscriptionContext logs for errors
- Verify RevenueCat customer info is being fetched

**Wrong entitlement name:**
- Must be `premium_access` in RevenueCat dashboard
- Must match code in `revenueCatService.ts`: `const ENTITLEMENT_ID = 'premium_access'`

**Paper not marked as premium:**
- Check Firebase/mock data
- `isPremium: true` must be set on premium papers

---

## Network/Connection Issues

### "Network error" During Purchase
**Solutions:**
1. Check internet connection (both wifi and cellular)
2. Try different network (switch wifi/cellular)
3. Disable VPN if using one (can interfere with App Store/Play Store)
4. Check if App Store/Play Store can be reached:
   - Open App Store/Play Store app
   - Try downloading a free app

### "Request timed out"
**Solutions:**
1. RevenueCat servers might be down (rare)
   - Check status: https://status.revenuecat.com
2. Increase timeout (if needed):
   - Usually not necessary, default is sufficient
3. Retry the operation

---

## Build/Deploy Issues

### "Expo Go not supported"
**Correct!** RevenueCat requires native code.

**Solution:** Use development builds:
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### EAS Build Fails
**Common issues:**

**Missing environment variables:**
```bash
# Set secrets in EAS
eas secret:create --scope project --name REVENUECAT_API_KEY_APPLE --value appl_...
eas secret:create --scope project --name REVENUECAT_API_KEY_GOOGLE --value goog_...
```

**Plugin configuration:**
- Verify `app.json` has:
```json
"plugins": [
  "expo-build-properties",
  "react-native-purchases"
]
```

### iOS Build: "Provisioning profile doesn't include in-app purchase"
**Solution:**
1. Xcode → Signing & Capabilities
2. Make sure "In-App Purchase" capability is enabled
3. Regenerate provisioning profile in Apple Developer portal

---

## Getting Help

### Where to Get Support

**RevenueCat Documentation:**
https://docs.revenuecat.com

**RevenueCat Community Forum:**
https://community.revenuecat.com

**RevenueCat Support:**
support@revenuecat.com (responds within 24 hours)

**Emergency Debugging Steps:**
1. Check RevenueCat Dashboard → Events (see all API calls)
2. Check console logs (Xcode/Android Studio)
3. Search RevenueCat community forum
4. Post in RevenueCat Discord (link on their website)

### Information to Include When Asking for Help

1. **Platform:** iOS or Android?
2. **Environment:** Sandbox/Test or Production?
3. **Error message:** Exact text of error
4. **Console logs:** Full error trace
5. **RevenueCat Customer ID:** From dashboard
6. **Steps to reproduce:** What did you do before error?
7. **Screenshots:** Of error and RevenueCat dashboard

---

## Prevention Tips

### Before Testing
- [ ] Verify .env has real API keys
- [ ] Check RevenueCat dashboard shows connected stores
- [ ] Confirm products are "Ready for Sale" / "Active"
- [ ] Ensure offerings are configured
- [ ] Test on physical device (not simulator/emulator)

### Before Production Launch
- [ ] Test on multiple devices (different iOS/Android versions)
- [ ] Test slow network conditions
- [ ] Test with different payment methods
- [ ] Verify restore purchases works
- [ ] Check premium content unlocks correctly
- [ ] Monitor RevenueCat dashboard during soft launch

---

**Still stuck?** Check the full setup guide: `REVENUECAT_SETUP_GUIDE.md`
