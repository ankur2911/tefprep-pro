import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../utils/colors';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { revenueCatService } from '../services/revenueCatService';
import { PurchasesPackage } from 'react-native-purchases';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SubscriptionScreen({ navigation }: Props) {
  const { subscription, hasActiveSubscription, refreshSubscription, offerings } = useSubscription();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Refresh subscription data and load packages when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshSubscription();
      loadPackages();
    }, [offerings])
  );

  // Set timeout for loading offerings
  useEffect(() => {
    const timer = setTimeout(() => {
      if (packages.length === 0) {
        console.log('⏰ Timeout waiting for offerings');
        setLoadingTimeout(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [packages]);

  const loadPackages = () => {
    console.log('🔍 loadPackages called');
    console.log('🔍 offerings:', offerings);
    console.log('🔍 offerings?.current:', offerings?.current);

    if (!offerings) {
      console.log('❌ No offerings object available');
      return;
    }

    if (!offerings?.current) {
      console.log('❌ No current offering available');
      console.log('🔍 All offerings keys:', Object.keys(offerings.all));

      // Try to use any available offering
      const allOfferingsKeys = Object.keys(offerings.all);
      if (allOfferingsKeys.length > 0) {
        const firstOfferingKey = allOfferingsKeys[0];
        const firstOffering = offerings.all[firstOfferingKey];
        console.log(`🔄 Using first available offering: "${firstOfferingKey}"`);
        console.log('🔍 First offering packages:', firstOffering.availablePackages.length);

        if (firstOffering.availablePackages.length > 0) {
          setPackages(firstOffering.availablePackages);
          console.log('✅ Loaded', firstOffering.availablePackages.length, 'packages from first offering');
          return;
        }
      }

      console.log('❌ No offerings have any packages');
      return;
    }

    const availablePackages = offerings.current.availablePackages;
    console.log('🔍 Current offering identifier:', offerings.current.identifier);
    console.log('🔍 Available packages count:', availablePackages.length);

    if (availablePackages.length === 0) {
      console.log('❌ Current offering has 0 packages');
      console.log('🔍 Checking all offerings for packages...');

      Object.keys(offerings.all).forEach(key => {
        const offering = offerings.all[key];
        console.log(`   - Offering "${key}": ${offering.availablePackages.length} packages`);
      });
    }

    setPackages(availablePackages);
    console.log('✅ Loaded', availablePackages.length, 'packages from RevenueCat');
    availablePackages.forEach((pkg, index) => {
      console.log(`📦 Package ${index + 1}:`, pkg.identifier, pkg.product.identifier, pkg.product.priceString);
    });
  };

  const getPackageDetails = (pkg: PurchasesPackage) => {
    const isMonthly = pkg.identifier === 'monthly' || pkg.product.identifier.includes('monthly');

    return {
      id: pkg.identifier,
      name: isMonthly ? 'Monthly Plan' : 'Yearly Plan',
      price: pkg.product.priceString,
      period: isMonthly ? '/month' : '/year',
      savings: isMonthly ? null : 'Save $20/year',
      features: isMonthly
        ? [
            'Access to all premium papers',
            'Unlimited test attempts',
            'Detailed performance analytics',
            'New content added regularly',
            'Cancel anytime',
          ]
        : [
            'Everything in Monthly Plan',
            'Best value - 2 months free',
            'Priority support',
            'Early access to new features',
            'Exclusive study materials',
          ],
      popular: !isMonthly,
      package: pkg,
    };
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (!user) {
      Alert.alert('Error', 'Please login to subscribe');
      return;
    }

    const details = getPackageDetails(pkg);

    Alert.alert(
      'Confirm Subscription',
      `Subscribe to ${details.name} for ${details.price}${details.period}?\n\n` +
        (hasActiveSubscription
          ? 'This will switch your current plan.'
          : 'You will get instant access to all premium papers.'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await revenueCatService.purchasePackage(pkg);

              if (result.success) {
                await refreshSubscription();

                Alert.alert(
                  'Welcome to Premium! 🎉',
                  `You are now subscribed to the ${details.name}.\n\nAll premium papers are now unlocked!`,
                  [
                    {
                      text: 'Start Learning',
                      onPress: () => {
                        if (navigation.canGoBack()) {
                          navigation.goBack();
                        }
                      },
                    },
                  ]
                );
              }
            } catch (error: any) {
              // Handle specific errors
              if (error.message === 'CANCELLED') {
                // User cancelled, do nothing
                return;
              }

              if (error.message === 'PAYMENT_PENDING') {
                Alert.alert(
                  'Payment Pending',
                  'Your payment is being processed. You will get access once the payment is confirmed.'
                );
                return;
              }

              // Generic error
              Alert.alert(
                'Purchase Failed',
                error.message || 'Failed to complete purchase. Please try again.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    if (!user) return;

    const platformName = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

    Alert.alert(
      'Manage Subscription',
      `To manage or cancel your subscription, please visit your ${platformName} account settings.\n\nWould you like to open ${platformName} now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Open ${platformName}`,
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('https://apps.apple.com/account/subscriptions');
            } else {
              Linking.openURL('https://play.google.com/store/account/subscriptions');
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    setLoading(true);
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      await refreshSubscription();

      const hasActiveEntitlement = customerInfo.entitlements.active['premium_access'] !== undefined;

      if (hasActiveEntitlement) {
        Alert.alert(
          'Success! 🎉',
          'Your purchases have been restored successfully!\n\nYou now have access to all premium content.'
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No active subscriptions were found to restore.\n\nIf you believe this is an error, please contact support.'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again or contact support if the problem persists.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock all premium papers and master your French certification
          </Text>
        </View>

        {hasActiveSubscription && subscription && (
          <View style={styles.currentPlanCard}>
            <Text style={styles.currentPlanBadge}>✓ Active</Text>
            <Text style={styles.currentPlanTitle}>Current Plan</Text>
            <Text style={styles.currentPlanName}>
              {subscription.plan === 'monthly' ? 'Monthly' : subscription.plan === 'yearly' ? 'Yearly' : 'Premium'} Subscription
            </Text>
            {subscription.expirationDate && (
              <Text style={styles.currentPlanExpiry}>
                {subscription.willRenew ? 'Renews' : 'Expires'} on{' '}
                {new Date(subscription.expirationDate).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity
              style={styles.manageButton}
              onPress={handleManageSubscription}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.plansContainer}>
          {packages.length > 0 ? (
            packages.map((pkg) => {
              const plan = getPackageDetails(pkg);
              return (
                <View
                  key={plan.id}
                  style={[styles.planCard, plan.popular && styles.popularPlan]}
                >
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>⭐ Most Popular</Text>
                    </View>
                  )}

                  <Text style={styles.planName}>{plan.name}</Text>

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{plan.price}</Text>
                    <Text style={styles.period}>{plan.period}</Text>
                  </View>

                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}

                  <View style={styles.featuresContainer}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Text style={styles.checkmark}>✓</Text>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.subscribeButton,
                      plan.popular && styles.popularSubscribeButton,
                    ]}
                    onPress={() => handlePurchase(plan.package)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.subscribeButtonText,
                        plan.popular && styles.popularSubscribeButtonText,
                      ]}
                    >
                      {hasActiveSubscription ? 'Switch Plan' : 'Subscribe Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : loadingTimeout || !offerings ? (
            <View style={styles.loadingPackages}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Unable to Load Plans</Text>
              <Text style={styles.errorText}>
                {!offerings
                  ? 'Subscription service is initializing. Please try again in a moment.'
                  : 'We couldn\'t load the subscription plans. Please check your internet connection and try again.'}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setLoadingTimeout(false);
                  refreshSubscription();
                  loadPackages();
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loadingPackages}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingPackagesText}>Loading plans...</Text>
            </View>
          )}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Subscribe?</Text>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>📚</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Comprehensive Content</Text>
              <Text style={styles.benefitDescription}>
                Access to all premium TEF practice papers covering every section
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Advanced Practice Papers</Text>
              <Text style={styles.benefitDescription}>
                Access to B1, B2, and complete test simulations for advanced preparation
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Unlimited Practice</Text>
              <Text style={styles.benefitDescription}>
                Take premium tests as many times as you want with no restrictions
              </Text>
            </View>
          </View>
        </View>

        {/* Restore Purchases Button (Required for iOS) */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={loading}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Subscriptions will auto-renew unless cancelled at least 24 hours before the end of the current period.
            Manage your subscription in your {Platform.OS === 'ios' ? 'App Store' : 'Google Play'} account settings.
          </Text>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  currentPlanCard: {
    backgroundColor: Colors.success + '20',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  currentPlanBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: 8,
  },
  currentPlanTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  currentPlanExpiry: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  manageButton: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  manageButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  plansContainer: {
    padding: 16,
    gap: 16,
  },
  loadingPackages: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  loadingPackagesText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  popularPlan: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  period: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  savingsText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkmark: {
    fontSize: 18,
    color: Colors.success,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  subscribeButton: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  popularSubscribeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subscribeButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  popularSubscribeButtonText: {
    color: Colors.textInverse,
  },
  benefitsSection: {
    padding: 16,
    paddingTop: 8,
  },
  benefitsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  restoreButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  restoreButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: Colors.surface,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
