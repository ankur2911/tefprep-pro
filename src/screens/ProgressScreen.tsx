import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../utils/colors';
import { useAuth } from '../context/AuthContext';
import { testAttemptService } from '../services/testAttemptService';
import { TestAttempt } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ProgressScreen({ navigation }: Props) {
  const { user, guestMode, logout } = useAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load attempts if user is logged in (not guest mode)
    if (user && !guestMode) {
      loadAttempts();
    } else {
      setLoading(false);
      setAttempts([]); // Clear any existing attempts
    }
  }, [user, guestMode]);

  // Refresh attempts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Only load attempts if user is logged in (not guest mode)
      if (user && !guestMode) {
        loadAttempts();
      }
    }, [user, guestMode])
  );

  const loadAttempts = async () => {
    if (!user) return;

    try {
      const userAttempts = await testAttemptService.getUserAttempts(user.uid);
      setAttempts(userAttempts);
    } catch (error) {
      console.error('Error loading attempts:', error);
      Alert.alert(
        'Error',
        'Failed to load your test history. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt for guests or non-authenticated users
  if (!user || guestMode) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>👤</Text>
        <Text style={styles.emptyTitle}>Login Required</Text>
        <Text style={styles.emptyText}>
          {guestMode
            ? 'Create an account or login to track your progress and save your test results'
            : 'Please login to view your progress'}
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            // Log out of guest mode, which will automatically show Login screen
            logout();
          }}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const stats = testAttemptService.calculateStats(attempts);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Track your learning journey</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: Colors.primary + '20' }]}>
          <Text style={[styles.statValue, { color: Colors.primary }]}>
            {stats.totalTests}
          </Text>
          <Text style={styles.statLabel}>Tests Taken</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: Colors.secondary + '20' }]}>
          <Text style={[styles.statValue, { color: Colors.secondary }]}>
            {stats.averageScore}%
          </Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: Colors.success + '20' }]}>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {stats.bestScore}%
          </Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: Colors.warning + '20' }]}>
          <Text style={[styles.statValue, { color: Colors.warning }]}>
            {stats.totalTimeSpent}
          </Text>
          <Text style={styles.statLabel}>Minutes Studied</Text>
        </View>
      </View>

      {stats.totalTests > 0 && (
        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>

          <View style={styles.performanceBar}>
            <View style={styles.performanceLabels}>
              <Text style={styles.performanceLabel}>Excellent</Text>
              <Text style={styles.performanceLabel}>Good</Text>
              <Text style={styles.performanceLabel}>Needs Work</Text>
            </View>

            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${stats.averageScore}%`,
                    backgroundColor:
                      stats.averageScore >= 80
                        ? Colors.success
                        : stats.averageScore >= 60
                        ? Colors.warning
                        : Colors.error,
                  },
                ]}
              />
            </View>

            <Text style={styles.performanceValue}>{stats.averageScore}%</Text>
          </View>
        </View>
      )}

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Tests</Text>

        {attempts.length === 0 ? (
          <View style={styles.noTestsCard}>
            <Text style={styles.noTestsIcon}>📝</Text>
            <Text style={styles.noTestsTitle}>No Tests Yet</Text>
            <Text style={styles.noTestsText}>
              Start practicing to see your progress here
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('PapersTab')}
            >
              <Text style={styles.browseButtonText}>Browse Papers</Text>
            </TouchableOpacity>
          </View>
        ) : (
          attempts.slice(0, 10).map((attempt, index) => {
            const percentage = Math.round(
              (attempt.score / attempt.totalQuestions) * 100
            );
            const passed = percentage >= 60;

            return (
              <View key={attempt.id} style={styles.attemptCard}>
                <View style={styles.attemptHeader}>
                  <View style={styles.attemptInfo}>
                    <Text style={styles.attemptTitle}>Test #{attempts.length - index}</Text>
                    <Text style={styles.attemptDate}>
                      {attempt.completedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.scoreCircle,
                      {
                        backgroundColor: passed
                          ? Colors.success + '20'
                          : Colors.error + '20',
                        borderColor: passed ? Colors.success : Colors.error,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreText,
                        { color: passed ? Colors.success : Colors.error },
                      ]}
                    >
                      {percentage}%
                    </Text>
                  </View>
                </View>

                <View style={styles.attemptStats}>
                  <View style={styles.attemptStat}>
                    <Text style={styles.attemptStatLabel}>Score:</Text>
                    <Text style={styles.attemptStatValue}>
                      {attempt.score}/{attempt.totalQuestions}
                    </Text>
                  </View>

                  <View style={styles.attemptStat}>
                    <Text style={styles.attemptStatLabel}>Time:</Text>
                    <Text style={styles.attemptStatValue}>
                      {Math.round(attempt.timeSpent / 60)} min
                    </Text>
                  </View>

                  <View style={styles.attemptStat}>
                    <Text style={styles.attemptStatLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.attemptStatValue,
                        { color: passed ? Colors.success : Colors.error },
                      ]}
                    >
                      {passed ? 'Passed' : 'Failed'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {attempts.length > 10 && (
        <View style={styles.moreSection}>
          <Text style={styles.moreText}>
            Showing 10 most recent tests out of {attempts.length}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  performanceCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  performanceBar: {
    gap: 12,
  },
  performanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  barContainer: {
    height: 32,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 16,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  recentSection: {
    padding: 16,
  },
  attemptCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  attemptInfo: {
    flex: 1,
  },
  attemptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  attemptDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attemptStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attemptStat: {
    flex: 1,
  },
  attemptStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  attemptStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  noTestsCard: {
    backgroundColor: Colors.surface,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noTestsIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noTestsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  noTestsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  moreSection: {
    padding: 20,
    alignItems: 'center',
  },
  moreText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
