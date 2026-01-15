# RevenueCat Quick Start - TEFPrep Pro

**🎯 Goal:** Enable real in-app purchases for iOS and Android

**⏱️ Total Time:** 2-3 hours

**💰 Cost:** Free tier (up to $2,500/month revenue)

---

## What You've Already Done ✅

Your app is already fully integrated with RevenueCat! The code is complete and committed. Now you just need to configure the external services.

**Code Changes Completed:**
- ✅ RevenueCat SDK installed and configured
- ✅ Environment variables set up (.env file)
- ✅ Purchase flow implemented (iOS & Android)
- ✅ Subscription management working
- ✅ Restore purchases enabled
- ✅ Firestore sync for analytics
- ✅ Error handling in place

---

## What You Need to Do Now 🚀

Configure 3 external services:

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   RevenueCat    │────▶│  App Store       │────▶│  Your App (iOS)   │
│   Dashboard     │     │  Connect         │     │                   │
└─────────────────┘     └──────────────────┘     └───────────────────┘
        │
        │               ┌──────────────────┐     ┌───────────────────┐
        └──────────────▶│  Google Play     │────▶│  Your App         │
                        │  Console         │     │  (Android)        │
                        └──────────────────┘     └───────────────────┘
```

---

## The 3 Services You'll Configure

### 1️⃣ RevenueCat (Free Account)
**What it does:** Central hub that connects your app to App Store and Google Play
**Time:** 10 minutes
**URL:** https://app.revenuecat.com

**Tasks:**
- Create account
- Add iOS and Android apps
- Copy API keys

### 2️⃣ Apple App Store Connect ($99/year)
**What it does:** iOS subscription management
**Time:** 30-40 minutes
**URL:** https://appstoreconnect.apple.com

**Tasks:**
- Create 2 subscription products ($9.99/month, $99/year)
- Submit for review
- Create sandbox test account
- Generate API key for RevenueCat

### 3️⃣ Google Play Console ($25 one-time)
**What it does:** Android subscription management
**Time:** 30-40 minutes
**URL:** https://play.google.com/console

**Tasks:**
- Create 2 subscription products ($9.99/month, $99/year)
- Set up internal testing
- Add test users
- Link to RevenueCat

---

## Detailed Guides Available

We've created 3 guides to help you:

### 📘 Full Setup Guide
**File:** `REVENUECAT_SETUP_GUIDE.md`
**Use for:** Step-by-step instructions with screenshots descriptions
**Covers:** All 11 steps in detail

### ✅ Checklist
**File:** `SETUP_CHECKLIST.md`
**Use for:** Track your progress (print this!)
**Covers:** Quick reference of all tasks

### 🔧 Troubleshooting
**File:** `TROUBLESHOOTING.md`
**Use for:** When something doesn't work
**Covers:** Common issues and solutions

---

## Step-by-Step Overview

### Phase 1: Initial Setup (1 hour)

**Step 1: RevenueCat Account (10 min)**
1. Sign up → Create project → Add apps → Copy API keys

**Step 2: iOS Setup (30 min)**
1. Create subscriptions in App Store Connect
2. Submit for review (takes 24-48 hours)
3. Create sandbox test account

**Step 3: Android Setup (30 min)**
1. Create subscriptions in Play Console
2. Set up internal testing
3. Add test users

### Phase 2: Connection (30 min)

**Step 4: Link App Store to RevenueCat (10 min)**
1. Generate API key in App Store Connect
2. Upload .p8 file to RevenueCat
3. Verify connection

**Step 5: Link Play Store to RevenueCat (15 min)**
1. Create service account in Google Cloud
2. Download JSON key
3. Link to Play Console
4. Upload to RevenueCat

**Step 6: Configure Products (10 min)**
1. Create entitlement: `premium_access`
2. Import products from stores
3. Create offering: `default`
4. Add packages: `monthly` and `yearly`

### Phase 3: Testing (1 hour)

**Step 7: Update .env File (5 min)**
1. Open `.env` file
2. Paste your real API keys
3. Save

**Step 8: Test iOS (30 min)**
1. Build on physical iPhone
2. Purchase subscription (sandbox)
3. Verify premium unlocks
4. Test restore purchases

**Step 9: Test Android (30 min)**
1. Build and install on physical Android
2. Purchase subscription (test mode)
3. Verify premium unlocks
4. Test restore purchases

---

## Critical Information to Note

### Product IDs (MUST BE EXACT!)
```
com.tefprep.pro.monthly  → $9.99/month
com.tefprep.pro.yearly   → $99.00/year
```
⚠️ These MUST match exactly in:
- App Store Connect
- Google Play Console
- RevenueCat Dashboard

### RevenueCat Configuration (MUST MATCH CODE!)
```
Entitlement ID: premium_access
Offering ID: default
Package IDs: monthly, yearly
```

### Your Bundle/Package Identifiers
```
iOS Bundle ID: com.tefprep.pro
Android Package: com.tefprep.pro
```

---

## What Happens After Setup?

### For Users (iOS):
1. User taps "Subscribe Now" in your app
2. iOS payment dialog appears (Apple handles payment)
3. User completes purchase with Face ID/Touch ID
4. Premium content unlocks immediately
5. User manages subscription in Settings → [Name] → Subscriptions

### For Users (Android):
1. User taps "Subscribe Now" in your app
2. Google Play payment dialog appears
3. User completes purchase
4. Premium content unlocks immediately
5. User manages subscription in Play Store → Account → Subscriptions

### For You (Developer):
1. RevenueCat tracks all subscriptions
2. View revenue in RevenueCat dashboard
3. Apple/Google deposit payments to your bank
4. Monitor churn, conversions, etc.

---

## Testing vs Production

### Sandbox/Test Mode (What You'll Use First)
- **iOS:** Use sandbox tester account (fake Apple ID)
- **Android:** Use license testing (no real charges)
- **RevenueCat:** Shows "Sandbox" badge in dashboard
- **You:** Not charged, can test unlimited times

### Production Mode (After Launch)
- **iOS:** Real App Store purchases
- **Android:** Real Google Play purchases
- **RevenueCat:** Tracks real revenue
- **Users:** Actually charged
- **You:** Receive payouts from Apple/Google

---

## Important Notes

### ⚠️ Things That Must Match Exactly
- Product IDs in all 3 systems
- Bundle ID (iOS) / Package Name (Android)
- Entitlement name in code and RevenueCat
- Offering and package IDs

### 📝 Things to Remember
- iOS review takes 24-48 hours
- Must test on physical devices (not simulators)
- API keys go in .env file (never commit to git)
- Subscription status syncs automatically via RevenueCat

### 🎯 Success Criteria
Before launching to production, ensure:
- [ ] Can purchase on iOS (sandbox)
- [ ] Can purchase on Android (test mode)
- [ ] Premium content unlocks
- [ ] Restore purchases works
- [ ] Subscription status shows in Profile
- [ ] Can manage/cancel subscription

---

## Next Steps - Start Here! 👇

1. **Read this document** completely (you are here!)
2. **Open** `SETUP_CHECKLIST.md` and print it
3. **Follow** `REVENUECAT_SETUP_GUIDE.md` step by step
4. **Keep** `TROUBLESHOOTING.md` handy for issues
5. **Test** on both platforms
6. **Launch!** 🚀

---

## Estimated Timeline

| Task | Time | Can Do Today? |
|------|------|---------------|
| RevenueCat setup | 10 min | ✅ Yes |
| iOS setup | 30 min | ✅ Yes |
| Android setup | 30 min | ✅ Yes |
| Connect stores to RevenueCat | 30 min | ✅ Yes |
| Update .env with real keys | 5 min | ✅ Yes |
| **Apple Review** | **24-48 hours** | ⏳ **Wait** |
| Test iOS (after approval) | 30 min | After review |
| Test Android | 30 min | ✅ Yes (can do while waiting) |
| Launch to production | 15 min | After testing |

**Total active work:** 2-3 hours
**Total waiting time:** 1-2 days (for Apple review)

---

## Common Questions

**Q: Do I need to pay anything to set this up?**
A: Just the Apple Developer ($99/year) and Google Play ($25 one-time) accounts. RevenueCat is free for your first $2,500/month in revenue.

**Q: Can I test without being charged?**
A: Yes! iOS uses sandbox accounts and Android uses license testing. You won't be charged during testing.

**Q: How long does Apple review take?**
A: Typically 24-48 hours, but can be up to 5 days.

**Q: Can I start with just iOS or just Android?**
A: Yes! You can set up one platform first and add the other later.

**Q: What if something breaks?**
A: Check `TROUBLESHOOTING.md` for common issues and solutions.

**Q: Do users' subscriptions auto-renew?**
A: Yes, Apple and Google handle all renewals automatically.

**Q: How do I get paid?**
A: Apple pays monthly to your bank account (minus 30% fee). Google pays monthly (minus 30% fee). RevenueCat doesn't take additional fees at your revenue level.

---

## Support Resources

**RevenueCat Docs:** https://docs.revenuecat.com
**Apple Developer:** https://developer.apple.com
**Google Play Help:** https://support.google.com/googleplay/android-developer

**Need Help?**
- Email RevenueCat: support@revenuecat.com
- Check our troubleshooting guide: `TROUBLESHOOTING.md`

---

## You're Almost Ready! 🎉

Your app is already fully integrated. Now just follow the setup guides to configure the external services, test on both platforms, and launch!

**Start here:** Open `REVENUECAT_SETUP_GUIDE.md` and begin with Step 1.

Good luck! 🚀
