import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../utils/colors';
import { Paper } from '../../types';
import { paperService } from '../../services/paperService';
import { MOCK_PAPERS } from '../../utils/mockData';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ManagePapersScreen({ navigation }: Props) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      // Try to fetch from Firebase, fallback to mock data
      const fetchedPapers = await paperService.getAllPapers();
      if (fetchedPapers.length > 0) {
        setPapers(fetchedPapers);
      } else {
        // Use mock data if Firebase is empty
        setPapers(MOCK_PAPERS);
      }
    } catch (error) {
      console.log('Using mock data:', error);
      setPapers(MOCK_PAPERS);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (paper: Paper) => {
    Alert.alert(
      'Delete Paper',
      `Are you sure you want to delete "${paper.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await paperService.deletePaper(paper.id);
              Alert.alert('Success', 'Paper deleted successfully');
              loadPapers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete paper. Using mock data.');
            }
          },
        },
      ]
    );
  };

  const renderPaper = ({ item }: { item: Paper }) => (
    <View style={styles.paperCard}>
      <View style={styles.paperHeader}>
        <View style={styles.paperInfo}>
          <Text style={styles.paperTitle}>{item.title}</Text>
          <Text style={styles.paperCategory}>{item.category}</Text>
          <View style={styles.paperMeta}>
            <Text style={styles.metaText}>
              {item.questionsCount} questions • {item.duration} min
            </Text>
            <View
              style={[
                styles.badge,
                item.isPremium ? styles.premiumBadge : styles.freeBadge,
              ]}
            >
              <Text style={styles.badgeText}>
                {item.isPremium ? 'Premium' : 'Free'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('AddEditPaper', { paper: item })}
        >
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.questionsBtn]}
          onPress={() => navigation.navigate('ManageQuestions', { paper: item })}
        >
          <Text style={styles.actionBtnText}>Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Papers</Text>
        <Text style={styles.headerSubtitle}>{papers.length} papers</Text>
      </View>

      <FlatList
        data={papers}
        renderItem={renderPaper}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No papers yet</Text>
            <Text style={styles.emptySubtext}>Add your first practice paper</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditPaper')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
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
  paperInfo: {
    flex: 1,
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
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumBadge: {
    backgroundColor: '#FEF3C7',
  },
  freeBadge: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: Colors.secondary,
  },
  questionsBtn: {
    backgroundColor: Colors.success,
  },
  deleteBtn: {
    backgroundColor: Colors.error,
  },
  actionBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    color: Colors.textInverse,
    fontSize: 32,
    fontWeight: 'bold',
  },
});
