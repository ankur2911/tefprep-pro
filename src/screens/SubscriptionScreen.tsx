import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../utils/colors';
import { useSubscription } from '../context/SubscriptionContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SubscriptionScreen({ navigation }: Props) {
  const { subscription, hasActiveSubscription } = useSubscription();

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$9.99',
      period: '/month',
      features: [
        'Access to all premium papers',
        'Unlimited test attempts',
        'Detailed performance analytics',
        'New content added regularly',
        'Cancel anytime',
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '$99',
      period: '/year',
      savings: 'Save $20/year',
      features: [
        'Everything in Monthly Plan',
        'Best value - 2 months free',
        'Priority support',
        'Early access to new features',
        'Exclusive study materials',
      ],
      popular: true,
    },
  ];

  const handleSubscribe = (planId: string) => {
    Alert.alert(
      'Subscribe',
      'Stripe payment integration coming soon!\n\nThis will open the payment flow to subscribe to the ' +
        (planId === 'monthly' ? 'Monthly' : 'Yearly') +
        ' plan.',
      [{ text: 'OK' }]
    );
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'You can manage your subscription, update payment method, or cancel anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Your subscription has been cancelled.');
          },
        },
      ]
    );
  };

  return (
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
            {subscription.plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
          </Text>
          <Text style={styles.currentPlanExpiry}>
            {subscription.autoRenew ? 'Renews' : 'Expires'} on{' '}
            {subscription.endDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleManageSubscription}
          >
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
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
              onPress={() => handleSubscribe(plan.id)}
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
        ))}
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
          <Text style={styles.benefitIcon}>📊</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Track Your Progress</Text>
            <Text style={styles.benefitDescription}>
              Detailed analytics to help you improve and identify weak areas
            </Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitIcon}>🎯</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Exam-Ready Practice</Text>
            <Text style={styles.benefitDescription}>
              Realistic test conditions with timed tests and instant feedback
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Cancel anytime. No questions asked. Full refund within 7 days.
        </Text>
      </View>
    </ScrollView>
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
});
