import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../utils/colors';
import { Paper } from '../types';
import { paperService } from '../services/paperService';
import { MOCK_PAPERS, CATEGORIES, getQuestionCount } from '../utils/mockData';
import { useSubscription } from '../context/SubscriptionContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function PapersScreen({ navigation }: Props) {
  const { canAccessPaper } = useSubscription();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    loadPapers();
  }, []);

  // Refresh papers when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPapers();
    }, [])
  );

  const loadPapers = async () => {
    try {
      setLoading(true);
      console.log('Loading papers from Firebase...');

      // Try to load from Firebase first
      const fetchedPapers = await paperService.getAllPapers();
      console.log(`Fetched ${fetchedPapers.length} papers from Firebase`);

      if (fetchedPapers.length > 0) {
        setPapers(fetchedPapers);
        console.log('Using Firebase papers');
      } else {
        // Fallback to mock data if Firebase is empty
        console.log('No papers in Firebase, using mock data');
        setPapers(MOCK_PAPERS);
      }
    } catch (error) {
      console.error('Error loading from Firebase, using mock data:', error);
      setPapers(MOCK_PAPERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPapers();
  };

  const filteredPapers =
    selectedCategory === 'Tous'
      ? papers
      : papers.filter((p) => p.category === selectedCategory);

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

  const renderPaper = ({ item }: { item: Paper }) => {
    const hasAccess = canAccessPaper(item.isPremium);

    return (
      <TouchableOpacity
        style={styles.paperCard}
        onPress={() => navigation.navigate('PaperDetail', { paper: item })}
        activeOpacity={0.7}
      >
        <View style={styles.paperHeader}>
          <View style={styles.paperBadges}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.difficulty) + '15' },
                { borderColor: getDifficultyColor(item.difficulty) + '40' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(item.difficulty) },
                ]}
              >
                {item.difficulty}
              </Text>
            </View>

            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>

          {!hasAccess && (
            <View style={styles.lockedIcon}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
          )}
        </View>

        <Text style={styles.paperTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.paperDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.paperFooter}>
          <View style={styles.paperMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📝</Text>
              <Text style={styles.metaText}>{getQuestionCount(item.id)}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaText}>{item.duration} min</Text>
            </View>
          </View>

          <Text style={styles.categoryTag}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Papers</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPapers.length} {filteredPapers.length === 1 ? 'paper' : 'papers'} available
        </Text>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPapers}
        renderItem={renderPaper}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>No papers found</Text>
            <Text style={styles.emptySubtext}>
              Try selecting a different category or pull down to refresh
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoriesWrapper: {
    height: 72,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesScroll: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  categoryChipTextSelected: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  paperCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  paperBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  premiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  lockedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  lockText: {
    fontSize: 14,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  paperDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  paperFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paperMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryTag: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
