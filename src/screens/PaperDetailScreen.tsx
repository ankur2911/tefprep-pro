import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../utils/colors';
import { Paper, TestAttempt } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { testAttemptService } from '../services/testAttemptService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { paper: Paper } }, 'params'>;
};

export default function PaperDetailScreen({ navigation, route }: Props) {
  const { paper } = route.params;
  const { user } = useAuth();
  const { canAccessPaper, hasActiveSubscription } = useSubscription();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  const hasAccess = canAccessPaper(paper.isPremium);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userAttempts = await testAttemptService.getPaperAttempts(user.uid, paper.id);
      setAttempts(userAttempts);
    } catch (error) {
      console.error('Error loading attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to take tests',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    if (!hasAccess) {
      Alert.alert(
        'Premium Content',
        'This paper requires an active subscription. Would you like to subscribe?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Subscribe', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }

    navigation.navigate('Test', { paper });
  };

  const bestAttempt =
    attempts.length > 0
      ? attempts.reduce((best, current) =>
          (current.score / current.totalQuestions) > (best.score / best.totalQuestions)
            ? current
            : best
        )
      : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return Colors.success;
      case 'Intermediate':
        return Colors.warning;
      case 'Advanced':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badges}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(paper.difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(paper.difficulty) },
                ]}
              >
                {paper.difficulty}
              </Text>
            </View>

            {paper.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>👑 Premium</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{paper.title}</Text>
          <Text style={styles.category}>{paper.category}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📝</Text>
              <View>
                <Text style={styles.infoValue}>{paper.questionsCount}</Text>
                <Text style={styles.infoLabel}>Questions</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <View>
                <Text style={styles.infoValue}>{paper.duration}</Text>
                <Text style={styles.infoLabel}>Minutes</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📊</Text>
              <View>
                <Text style={styles.infoValue}>{attempts.length}</Text>
                <Text style={styles.infoLabel}>Attempts</Text>
              </View>
            </View>
          </View>
        </View>

        {bestAttempt && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Best Score</Text>
            <View style={styles.statsContent}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scorePercentage}>
                  {Math.round((bestAttempt.score / bestAttempt.totalQuestions) * 100)}%
                </Text>
                <Text style={styles.scoreLabel}>
                  {bestAttempt.score}/{bestAttempt.totalQuestions}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About This Test</Text>
          <Text style={styles.description}>{paper.description}</Text>
        </View>

        {!hasAccess && (
          <View style={styles.lockCard}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockTitle}>Premium Content</Text>
            <Text style={styles.lockDescription}>
              Subscribe to access all premium papers and unlock your full potential
            </Text>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.subscribeButtonText}>View Subscription Plans</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, !hasAccess && styles.startButtonDisabled]}
          onPress={handleStartTest}
        >
          <Text style={styles.startButtonText}>
            {hasAccess ? 'Start Test' : 'Subscribe to Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    paddingTop: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 32,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContent: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '20',
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  descriptionCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  lockCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  lockDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: Colors.warning,
  },
  startButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
