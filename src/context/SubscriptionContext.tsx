import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { revenueCatService } from '../services/revenueCatService';
import Purchases, { CustomerInfo, PurchasesOfferings } from 'react-native-purchases';

interface SubscriptionDetails {
  hasActiveSubscription: boolean;
  productIdentifier: string | null;
  expirationDate: string | null;
  willRenew: boolean;
  plan: 'monthly' | 'yearly' | null;
  isTestPremium?: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionDetails | null;
  loading: boolean;
  hasActiveSubscription: boolean;
  canAccessPaper: (isPremium: boolean) => boolean;
  refreshSubscription: () => Promise<void>;
  offerings: PurchasesOfferings | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);

  // Update isPremium flag in user document
  const updateUserPremiumStatus = async (isPremium: boolean) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isPremium,
        premiumUpdatedAt: Timestamp.fromDate(new Date()),
      });
      console.log(`✅ Updated user isPremium status to: ${isPremium}`);
    } catch (error) {
      console.error('❌ Failed to update user premium status:', error);
    }
  };

  // Sync RevenueCat data to Firestore for backup and analytics
  const syncToFirestore = async (customerInfo: CustomerInfo) => {
    if (!user) return;

    try {
      const details = await revenueCatService.getSubscriptionDetails();
      if (!details || !details.hasActiveSubscription) {
        // User lost premium, update user document
        await updateUserPremiumStatus(false);
        return;
      }

      const now = new Date();
      const expirationDate = details.expirationDate
        ? new Date(details.expirationDate)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

      // Determine plan from product identifier
      let plan: 'monthly' | 'yearly' = 'monthly';
      if (details.productIdentifier?.includes('yearly')) {
        plan = 'yearly';
      }

      const subscriptionData = {
        userId: user.uid,
        status: 'active',
        plan,
        startDate: Timestamp.fromDate(now),
        endDate: Timestamp.fromDate(expirationDate),
        autoRenew: details.willRenew,
        productIdentifier: details.productIdentifier,
        provider: 'revenuecat',
        lastSynced: Timestamp.fromDate(now),
      };

      await setDoc(doc(db, 'subscriptions', user.uid), subscriptionData);

      // Update isPremium flag in user document
      await updateUserPremiumStatus(true);

      console.log('✅ Synced subscription to Firestore');
    } catch (error) {
      console.error('❌ Failed to sync to Firestore:', error);
    }
  };

  // Fetch subscription from RevenueCat
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      // Check for test premium flag in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const isTestPremium = userDoc.exists() ? userDoc.data()?.testPremium === true : false;

      if (isTestPremium) {
        console.log('🧪 Test premium access enabled for user');
        setSubscription({
          hasActiveSubscription: true,
          productIdentifier: 'test_premium',
          expirationDate: null,
          willRenew: false,
          plan: null,
          isTestPremium: true,
        });
        setLoading(false);
        return;
      }

      const details = await revenueCatService.getSubscriptionDetails();

      if (details) {
        const plan = details.productIdentifier?.includes('yearly')
          ? 'yearly'
          : details.productIdentifier?.includes('monthly')
            ? 'monthly'
            : null;

        setSubscription({
          hasActiveSubscription: details.hasActiveSubscription,
          productIdentifier: details.productIdentifier,
          expirationDate: details.expirationDate,
          willRenew: details.willRenew,
          plan,
          isTestPremium: false,
        });

        // Sync to Firestore if active
        if (details.hasActiveSubscription) {
          const customerInfo = await revenueCatService.getCustomerInfo();
          if (customerInfo) {
            await syncToFirestore(customerInfo);
          }
        } else {
          // No active subscription, update user document
          await updateUserPremiumStatus(false);
        }
      } else {
        setSubscription(null);
        await updateUserPremiumStatus(false);
      }
    } catch (error) {
      console.error('❌ Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize RevenueCat and load offerings
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        // Initialize with user ID if available
        await revenueCatService.initialize(user?.uid);

        // Identify user if logged in
        if (user) {
          await revenueCatService.identifyUser(user.uid);
        }

        // Load offerings
        const offers = await revenueCatService.getOfferings();
        setOfferings(offers);
      } catch (error) {
        console.error('❌ Failed to initialize RevenueCat:', error);
      }
    };

    initializeRevenueCat();
  }, [user]);

  // Listen to subscription updates
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchSubscription();

    // Set up listener for purchase updates
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('📱 Customer info updated from RevenueCat');
      fetchSubscription();
    });

    // Cleanup - RevenueCat doesn't require explicit removal
    return () => {
      // Listener is automatically cleaned up
    };
  }, [user]);

  const hasActiveSubscription = subscription?.hasActiveSubscription ?? false;

  const canAccessPaper = (isPremium: boolean) => {
    if (!isPremium) return true;
    return hasActiveSubscription;
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        hasActiveSubscription,
        canAccessPaper,
        refreshSubscription,
        offerings,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
