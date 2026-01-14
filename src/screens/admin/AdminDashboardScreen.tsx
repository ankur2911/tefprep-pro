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
import { Colors } from '../../utils/colors';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function AdminDashboardScreen({ navigation }: Props) {
  const { user } = useAuth();

  const adminCards = [
    {
      title: 'Manage Papers',
      description: 'Add, edit, or delete practice papers',
      icon: '📄',
      route: 'ManagePapers',
      color: Colors.primary,
    },
    {
      title: 'View Statistics',
      description: 'See app usage and test statistics',
      icon: '📊',
      route: 'AdminStats',
      color: Colors.secondary,
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: '👥',
      route: 'ManageUsers',
      color: Colors.success,
    },
    {
      title: 'Subscriptions',
      description: 'Manage user subscriptions',
      icon: '💳',
      route: 'ManageSubscriptions',
      color: Colors.warning,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, Admin</Text>
      </View>

      <View style={styles.grid}>
        {adminCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: card.color }]}
            onPress={() => {
              if (card.route === 'ManagePapers') {
                navigation.navigate(card.route);
              } else {
                Alert.alert('Coming Soon', `${card.title} feature will be available soon!`);
              }
            }}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditPaper')}
        >
          <Text style={styles.actionButtonText}>+ Add New Paper</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => Alert.alert('Export', 'Export functionality coming soon')}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            📥 Export Data
          </Text>
        </TouchableOpacity>
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
  grid: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardArrow: {
    fontSize: 32,
    color: Colors.textSecondary,
  },
  quickActions: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
  },
});
