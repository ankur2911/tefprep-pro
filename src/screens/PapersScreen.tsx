import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../utils/colors';
import { Paper } from '../types';
import { paperService } from '../services/paperService';
import { MOCK_PAPERS, CATEGORIES } from '../utils/mockData';
import { useSubscription } from '../context/SubscriptionContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function PapersScreen({ navigation }: Props) {
  const { canAccessPaper } = useSubscription();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const fetchedPapers = await paperService.getAllPapers();
      if (fetchedPapers.length > 0) {
        setPapers(fetchedPapers);
      } else {
        setPapers(MOCK_PAPERS);
      }
    } catch (error) {
      console.log('Using mock data:', error);
      setPapers(MOCK_PAPERS);
    } finally {
      setLoading(false);
    }
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
      >
        <View style={styles.paperHeader}>
          <View style={styles.paperBadges}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.difficulty) + '20' },
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
                <Text style={styles.premiumText}>👑 Premium</Text>
              </View>
            )}
          </View>

          {!hasAccess && (
            <View style={styles.lockedIcon}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
          )}
        </View>

        <Text style={styles.paperTitle}>{item.title}</Text>
        <Text style={styles.paperDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.paperMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📝</Text>
            <Text style={styles.metaText}>{item.questionsCount} questions</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>{item.duration} min</Text>
          </View>
        </View>

        <Text style={styles.categoryTag}>{item.category}</Text>
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

      <FlatList
        data={filteredPapers}
        renderItem={renderPaper}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No papers found</Text>
            <Text style={styles.emptySubtext}>
              Try selecting a different category
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
  categoriesScroll: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesContainer: {
    padding: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paperBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  premiumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  lockedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 16,
  },
  paperTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  paperDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  paperMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryTag: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
