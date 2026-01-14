import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_PAPERS } from '../utils/mockData';
import { Paper } from '../types';
import { Colors } from '../utils/colors';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const featuredPapers = MOCK_PAPERS.slice(0, 3);

  const totalPapers = MOCK_PAPERS.length;
  const totalQuestions = MOCK_PAPERS.reduce((sum, paper) => sum + paper.questionsCount, 0);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Compréhension Orale': '🎧',
      'Expression Écrite': '✍️',
      'Compréhension Écrite': '📖',
      'Expression Orale': '🗣️',
      'Vocabulaire et Grammaire': '📚',
      'Test Complet': '🎯',
    };
    return icons[category] || '📝';
  };

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

  const renderPaper = ({ item }: { item: Paper }) => (
    <TouchableOpacity
      style={styles.paperCard}
      onPress={() => navigation.navigate('PapersTab', {
        screen: 'PaperDetail',
        params: { paper: item },
      })}
      activeOpacity={0.7}
    >
      <View style={[styles.paperIcon, { backgroundColor: Colors.primary + '15' }]}>
        <Text style={styles.paperIconText}>{getCategoryIcon(item.category)}</Text>
      </View>
      <View style={styles.paperInfo}>
        <View style={styles.paperHeader}>
          <Text style={styles.paperTitle} numberOfLines={2}>{item.title}</Text>
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
        <Text style={styles.paperCategory}>{item.category}</Text>
        <View style={styles.paperFooter}>
          <View style={styles.paperMeta}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.paperDuration}>{item.duration} min</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.metaIcon}>📝</Text>
            <Text style={styles.paperQuestions}>{item.questionsCount} questions</Text>
          </View>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) + '20' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: getDifficultyColor(item.difficulty) }
            ]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TEFPrep Pro</Text>
        <Text style={styles.subtitle}>
          {user ? `Welcome back!` : 'Master Your French Certification'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalPapers}</Text>
          <Text style={styles.statLabel}>Practice Papers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalQuestions}+</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Papers</Text>
        {featuredPapers.map((paper) => (
          <View key={paper.id}>{renderPaper({ item: paper })}</View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('PapersTab')}
      >
        <Text style={styles.exploreButtonText}>Explore All Papers</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.primary,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  paperCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paperIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paperIconText: {
    fontSize: 28,
  },
  paperInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  paperTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  paperCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  paperFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paperMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaSeparator: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginHorizontal: 6,
  },
  paperDuration: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  paperQuestions: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  premiumBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '600',
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
