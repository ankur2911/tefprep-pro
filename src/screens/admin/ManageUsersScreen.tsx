import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../utils/colors';
import { getAllUsers, toggleTestPremium, User } from '../../services/userService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ManageUsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleTogglePremium = async (userId: string, currentValue: boolean) => {
    const userName = users.find(u => u.id === userId)?.email || 'this user';

    Alert.alert(
      currentValue ? 'Remove Test Premium' : 'Grant Test Premium',
      `Are you sure you want to ${currentValue ? 'remove test premium from' : 'grant test premium to'} ${userName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await toggleTestPremium(userId, !currentValue);

              // Update local state
              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === userId
                    ? { ...user, testPremium: !currentValue }
                    : user
                )
              );

              Alert.alert(
                'Success',
                `Test premium ${!currentValue ? 'granted to' : 'removed from'} ${userName}`
              );
            } catch (error) {
              console.error('Error toggling premium:', error);
              Alert.alert('Error', 'Failed to update premium status. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.displayName || 'No Name'}</Text>
          <View style={styles.badgeContainer}>
            {item.isPremium && (
              <View style={styles.realPremiumBadge}>
                <Text style={styles.realPremiumBadgeText}>💎 PREMIUM</Text>
              </View>
            )}
            {item.testPremium && (
              <View style={styles.testPremiumBadge}>
                <Text style={styles.testPremiumBadgeText}>🧪 TEST</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userId}>ID: {item.id.substring(0, 12)}...</Text>
        {item.createdAt && (
          <Text style={styles.userDate}>
            Joined: {item.createdAt.toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.switchLabel}>Test Premium</Text>
        <Switch
          value={item.testPremium || false}
          onValueChange={() => handleTogglePremium(item.id, item.testPremium || false)}
          trackColor={{ false: Colors.border, true: Colors.success }}
          thumbColor={item.testPremium ? Colors.primary : Colors.surface}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>
          {users.length} {users.length === 1 ? 'user' : 'users'} total
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>
            💎 PREMIUM = Real paid subscription via RevenueCat
          </Text>
          <Text style={styles.infoText}>
            🧪 TEST = Manual override for testing (toggle below)
          </Text>
          <Text style={[styles.infoText, { marginTop: 8, fontStyle: 'italic' }]}>
            ⚠️ Missing users? Users created in Firebase Auth need to login once to appear here.
          </Text>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              Users will appear here once they sign up
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  infoBox: {
    backgroundColor: Colors.warning + '20',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  realPremiumBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  realPremiumBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  testPremiumBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  testPremiumBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: Colors.textDisabled,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  userDate: {
    fontSize: 12,
    color: Colors.textDisabled,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
