import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// Use process.env for production builds (EAS) and @env for development
const REVENUECAT_API_KEY_APPLE = process.env.REVENUECAT_API_KEY_APPLE || '';
const REVENUECAT_API_KEY_GOOGLE = process.env.REVENUECAT_API_KEY_GOOGLE || '';

// Entitlement identifier (must match RevenueCat dashboard configuration)
const ENTITLEMENT_ID = 'premium_access';

class RevenueCatService {
  private isInitialized = false;

  /**
   * Initialize RevenueCat SDK
   * Should be called once when app starts
   * @param userId Optional user ID to identify the user
   */
  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) {
      console.log('RevenueCat already initialized');
      return;
    }

    try {
      const apiKey = Platform.select({
        ios: REVENUECAT_API_KEY_APPLE,
        android: REVENUECAT_API_KEY_GOOGLE,
      });

      // Skip initialization if API key is not configured or is a placeholder
      if (!apiKey || apiKey.includes('xxxx') || apiKey.length < 20) {
        console.warn('⚠️ RevenueCat API key not configured. Skipping initialization. Subscriptions will not work until you add real API keys.');
        this.isInitialized = false;
        return;
      }

      // Configure SDK with debug logging in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Initialize with app user ID if available
      Purchases.configure({
        apiKey,
        appUserID: userId,
      });

      this.isInitialized = true;
      console.log('✅ RevenueCat initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      // Don't throw - allow app to continue without RevenueCat
      this.isInitialized = false;
    }
  }

  /**
   * Set user ID after login
   * This links the RevenueCat customer to your Firebase user
   * @param userId Firebase user ID
   */
  async identifyUser(userId: string): Promise<void> {
    try {
      const { customerInfo } = await Purchases.logIn(userId);
      console.log('✅ User identified in RevenueCat:', userId);
      return;
    } catch (error) {
      console.error('❌ Failed to identify user:', error);
      throw error;
    }
  }

  /**
   * Logout user from RevenueCat
   * Call this when user signs out
   */
  async logoutUser(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('✅ User logged out from RevenueCat');
    } catch (error) {
      console.error('❌ Failed to logout user:', error);
      throw error;
    }
  }

  /**
   * Get available offerings/packages from RevenueCat
   * @returns Offerings object containing available packages
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    if (!this.isInitialized) {
      console.warn('⚠️ RevenueCat not initialized');
      return null;
    }

    try {
      console.log('📡 Fetching offerings from RevenueCat...');
      const offerings = await Purchases.getOfferings();

      console.log('📦 Offerings response:', {
        hasCurrent: !!offerings.current,
        currentIdentifier: offerings.current?.identifier,
        currentPackagesCount: offerings.current?.availablePackages.length || 0,
        allOfferingsCount: Object.keys(offerings.all).length,
        allOfferingsKeys: Object.keys(offerings.all),
      });

      if (offerings.current) {
        console.log('✅ Current offering loaded:', offerings.current.identifier);
        console.log('   - Packages:', offerings.current.availablePackages.length);
        offerings.current.availablePackages.forEach((pkg, i) => {
          console.log(`   - Package ${i + 1}: ${pkg.identifier} (${pkg.product.identifier}) - ${pkg.product.priceString}`);
        });
      } else {
        console.warn('⚠️ No current offering found');

        // Log all available offerings
        Object.keys(offerings.all).forEach(key => {
          const offering = offerings.all[key];
          console.log(`   - Offering "${key}": ${offering.availablePackages.length} packages`);
        });
      }

      return offerings;
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   * @param packageToPurchase The package to purchase
   * @returns Purchase result with customer info
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo;
    success: boolean;
  }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      console.log('✅ Purchase successful');
      return { customerInfo, success: true };
    } catch (error: any) {
      // Handle specific error codes
      if (error.userCancelled) {
        console.log('ℹ️ User cancelled purchase');
        throw new Error('CANCELLED');
      }

      // Check for payment pending (common on Android)
      if (error.code === 'PAYMENT_PENDING_ERROR') {
        console.log('⏳ Payment pending');
        throw new Error('PAYMENT_PENDING');
      }

      // Network error
      if (error.code === 'NETWORK_ERROR') {
        console.error('🌐 Network error during purchase');
        throw new Error('Please check your internet connection and try again.');
      }

      // Generic error
      console.error('❌ Purchase failed:', error);
      throw new Error(error.message || 'Purchase failed. Please try again.');
    }
  }

  /**
   * Get customer info (includes entitlements and active subscriptions)
   * @returns Customer info object
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.isInitialized) {
      console.warn('⚠️ RevenueCat not initialized');
      return null;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('❌ Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Check if user has active premium subscription
   * @returns true if user has premium entitlement
   */
  async hasActivePremium(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      // Check if user has premium entitlement
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      const hasAccess = entitlement !== undefined && entitlement !== null;

      if (hasAccess) {
        console.log('✅ User has premium access');
      } else {
        console.log('ℹ️ User does not have premium access');
      }

      return hasAccess;
    } catch (error) {
      console.error('❌ Failed to check premium status:', error);
      return false;
    }
  }

  /**
   * Restore purchases (required for iOS)
   * @returns Customer info after restore
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('✅ Purchases restored successfully');
      return customerInfo;
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      throw new Error('Failed to restore purchases. Please try again.');
    }
  }

  /**
   * Get detailed subscription information
   * @returns Subscription details object
   */
  async getSubscriptionDetails(): Promise<{
    hasActiveSubscription: boolean;
    productIdentifier: string | null;
    expirationDate: string | null;
    willRenew: boolean;
    isInGracePeriod: boolean;
  } | null> {
    if (!this.isInitialized) {
      console.warn('⚠️ RevenueCat not initialized');
      return null;
    }

    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return null;

      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

      if (!entitlement) {
        return {
          hasActiveSubscription: false,
          productIdentifier: null,
          expirationDate: null,
          willRenew: false,
          isInGracePeriod: false,
        };
      }

      return {
        hasActiveSubscription: true,
        productIdentifier: entitlement.productIdentifier,
        expirationDate: entitlement.expirationDate,
        willRenew: entitlement.willRenew,
        isInGracePeriod: false,
      };
    } catch (error) {
      console.error('❌ Failed to get subscription details:', error);
      return null;
    }
  }

  /**
   * Get management URL for subscription
   * This is where users can manage their subscription in the App Store/Play Store
   * @returns Management URL
   */
  async getManagementURL(): Promise<string> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo?.managementURL || '';
    } catch (error) {
      console.error('❌ Failed to get management URL:', error);
      return '';
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
