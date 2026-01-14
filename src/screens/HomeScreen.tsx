import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
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

  const renderPaper = ({ item }: { item: Paper }) => (
    <TouchableOpacity
      style={styles.paperCard}
      onPress={() => navigation.navigate('PapersTab', {
        screen: 'PaperDetail',
        params: { paper: item },
      })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.paperImage} />
      <View style={styles.paperInfo}>
        <Text style={styles.paperTitle}>{item.title}</Text>
        <Text style={styles.paperCategory}>{item.category}</Text>
        <View style={styles.paperMeta}>
          <Text style={styles.paperDuration}>{item.duration} min</Text>
          <Text style={styles.paperQuestions}>{item.questionsCount} questions</Text>
        </View>
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paperImage: {
    width: '100%',
    height: 150,
  },
  paperInfo: {
    padding: 16,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  paperCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  paperMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  paperDuration: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  paperQuestions: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
