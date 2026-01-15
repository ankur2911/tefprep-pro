import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Subscription } from '../types';

export const subscriptionService = {
  /**
   * Create a new subscription for a user
   */
  async createSubscription(
    userId: string,
    plan: 'monthly' | 'yearly'
  ): Promise<void> {
    const now = new Date();
    const endDate = new Date();

    // Calculate end date based on plan
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscriptionData = {
      userId,
      status: 'active',
      plan,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(endDate),
      autoRenew: true,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };

    await setDoc(doc(db, 'subscriptions', userId), subscriptionData);
  },

  /**
   * Get user's subscription
   */
  async getSubscription(userId: string): Promise<Subscription | null> {
    const docRef = doc(db, 'subscriptions', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      status: data.status,
      plan: data.plan,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      autoRenew: data.autoRenew,
    };
  },

  /**
   * Cancel a user's subscription
   * Note: Subscription remains active until endDate, just won't auto-renew
   */
  async cancelSubscription(userId: string): Promise<void> {
    const docRef = doc(db, 'subscriptions', userId);
    await updateDoc(docRef, {
      // Keep status as 'active' so user retains access until endDate
      autoRenew: false,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  /**
   * Switch subscription plan
   */
  async switchPlan(
    userId: string,
    newPlan: 'monthly' | 'yearly'
  ): Promise<void> {
    const now = new Date();
    const endDate = new Date();

    // Calculate new end date based on plan
    if (newPlan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const docRef = doc(db, 'subscriptions', userId);
    await updateDoc(docRef, {
      plan: newPlan,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(endDate),
      status: 'active',
      autoRenew: true,
      updatedAt: Timestamp.fromDate(now),
    });
  },

  /**
   * Check if subscription is active and not expired
   */
  isSubscriptionActive(subscription: Subscription | null): boolean {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    return subscription.endDate > new Date();
  },
};
