# RevenueCat Setup Quick Checklist

Print this and check off as you complete each step!

---

## ☐ Step 1: RevenueCat Account (10 min)
- [ ] Sign up at https://app.revenuecat.com
- [ ] Create project "TEFPrep Pro"
- [ ] Add iOS app (Bundle ID: `com.tefprep.pro`)
- [ ] Add Android app (Package: `com.tefprep.pro`)
- [ ] Copy iOS API key (starts with `appl_`)
- [ ] Copy Android API key (starts with `goog_`)

---

## ☐ Step 2: iOS App Store Connect (30 min)
- [ ] Access https://appstoreconnect.apple.com
- [ ] Create/Select TEFPrep Pro app
- [ ] Create subscription group "TEFPrep Pro Premium"
- [ ] Create product: `com.tefprep.pro.monthly` ($9.99/month)
- [ ] Create product: `com.tefprep.pro.yearly` ($99/year)
- [ ] Submit both products for review
- [ ] Create sandbox test account
- [ ] Note sandbox email: _________________
- [ ] Note sandbox password: _________________

---

## ☐ Step 3: Android Google Play Console (30 min)
- [ ] Access https://play.google.com/console
- [ ] Create/Select TEFPrep Pro app
- [ ] Set up merchant account (if needed)
- [ ] Create subscription: `com.tefprep.pro.monthly` ($9.99/month)
- [ ] Create subscription: `com.tefprep.pro.yearly` ($99/year)
- [ ] Activate both subscriptions
- [ ] Create internal testing track
- [ ] Add test user email: _________________
- [ ] Enable license testing

---

## ☐ Step 4: Connect App Store to RevenueCat (10 min)
- [ ] Generate API Key in App Store Connect
- [ ] Download .p8 file
- [ ] Note Key ID: _________________
- [ ] Note Issuer ID: _________________
- [ ] Upload to RevenueCat → iOS App → Service Credentials
- [ ] Verify "✓ Connected" status

---

## ☐ Step 5: Connect Google Play to RevenueCat (15 min)
- [ ] Create service account in Google Cloud Console
- [ ] Download JSON key file
- [ ] Link service account to Play Console
- [ ] Grant "Financial data" and "Orders" permissions
- [ ] Upload JSON to RevenueCat → Android App → Service Credentials
- [ ] Verify "✓ Connected" status

---

## ☐ Step 6: Configure RevenueCat (10 min)
- [ ] Create entitlement: `premium_access`
- [ ] Verify iOS products imported
- [ ] Add Android products manually if needed
- [ ] Create offering: `default`
- [ ] Add package: `monthly` (link iOS + Android products)
- [ ] Add package: `yearly` (link iOS + Android products)
- [ ] Attach entitlement `premium_access` to all 4 products

---

## ☐ Step 7: Update .env File (5 min)
- [ ] Open `C:\Users\sharmaanku\EcommerceApp\.env`
- [ ] Replace `REVENUECAT_API_KEY_APPLE` with real key
- [ ] Replace `REVENUECAT_API_KEY_GOOGLE` with real key
- [ ] Save file
- [ ] Verify .env is in .gitignore

---

## ☐ Step 8: Test iOS (30 min)
- [ ] Sign out of App Store on test device
- [ ] Build and install app: `npx expo run:ios --device`
- [ ] Open app and login
- [ ] Navigate to Subscription screen
- [ ] Verify 2 plans load with prices
- [ ] Purchase monthly plan (use sandbox account)
- [ ] Verify success message and premium unlock
- [ ] Delete and reinstall app
- [ ] Restore purchases successfully
- [ ] Test "Manage Subscription" button

---

## ☐ Step 9: Test Android (30 min)
- [ ] Build APK or use internal testing
- [ ] Install on test device
- [ ] Open app and login
- [ ] Navigate to Subscription screen
- [ ] Verify 2 plans load with prices
- [ ] Purchase monthly plan
- [ ] Verify success message and premium unlock
- [ ] Clear app data
- [ ] Restore purchases successfully
- [ ] Test "Manage Subscription" button

---

## ☐ Step 10: Pre-Launch Final Checks
- [ ] Both platforms tested successfully
- [ ] No console errors during purchase flow
- [ ] Premium content unlocks correctly
- [ ] Subscription status shows in Profile
- [ ] Restore purchases works
- [ ] Manage subscription opens store settings
- [ ] Check RevenueCat dashboard shows test purchases

---

## ☐ Production Launch
- [ ] iOS products approved by Apple
- [ ] Android products active
- [ ] App metadata mentions subscriptions
- [ ] Screenshots show subscription screen
- [ ] Privacy policy updated
- [ ] Terms mention cancellation policy
- [ ] Submit iOS app for review
- [ ] Promote Android to production
- [ ] Monitor RevenueCat dashboard

---

## Important Info to Keep Handy

**RevenueCat Dashboard:** https://app.revenuecat.com

**iOS API Key:** `appl_________________`

**Android API Key:** `goog_________________`

**iOS Sandbox Account:**
- Email: _________________
- Password: _________________

**Android Test Account:**
- Email: _________________

**Product IDs (MUST BE EXACT):**
- Monthly: `com.tefprep.pro.monthly`
- Yearly: `com.tefprep.pro.yearly`

**RevenueCat Configuration (MUST MATCH CODE):**
- Entitlement: `premium_access`
- Offering: `default`
- Packages: `monthly`, `yearly`

---

## Quick Commands

**Run iOS:**
```bash
cd C:\Users\sharmaanku\EcommerceApp
npx expo run:ios --device
```

**Run Android:**
```bash
cd C:\Users\sharmaanku\EcommerceApp
npx expo run:android
```

**View iOS Logs:**
Open Xcode → Window → Devices and Simulators → Select device → View logs

**View Android Logs:**
```bash
adb logcat | grep -i revenuecat
```

---

## Emergency Contacts

**RevenueCat Support:** support@revenuecat.com
**Apple Developer:** https://developer.apple.com/contact/
**Google Play Support:** Through Play Console

---

**Estimated Total Setup Time:** 2-3 hours

**Ready to Launch?** ✓ All checkboxes above should be checked!
