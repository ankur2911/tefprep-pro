import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../../utils/colors';
import { Paper } from '../../types';
import { paperService } from '../../services/paperService';
import { CATEGORIES } from '../../utils/mockData';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params?: { paper?: Paper } }, 'params'>;
};

export default function AddEditPaperScreen({ navigation, route }: Props) {
  const existingPaper = route.params?.paper;
  const isEditing = !!existingPaper;

  const [title, setTitle] = useState(existingPaper?.title || '');
  const [description, setDescription] = useState(existingPaper?.description || '');
  const [category, setCategory] = useState(existingPaper?.category || CATEGORIES[1]);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    existingPaper?.difficulty || 'Beginner'
  );
  const [duration, setDuration] = useState(existingPaper?.duration.toString() || '30');
  const [questionsCount, setQuestionsCount] = useState(
    existingPaper?.questionsCount.toString() || '25'
  );
  const [thumbnail, setThumbnail] = useState(existingPaper?.thumbnail || '');
  const [isPremium, setIsPremium] = useState(existingPaper?.isPremium || false);
  const [saving, setSaving] = useState(false);

  const difficulties: Array<'Beginner' | 'Intermediate' | 'Advanced'> = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  const handleSave = async () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const paperData: Omit<Paper, 'id'> = {
        title,
        description,
        category,
        difficulty,
        duration: parseInt(duration) || 30,
        questionsCount: parseInt(questionsCount) || 25,
        thumbnail: thumbnail || `https://via.placeholder.com/400x250/${Colors.primary.replace('#', '')}/ffffff?text=${encodeURIComponent(title)}`,
        isPremium,
        questions: existingPaper?.questions || [],
      };

      if (isEditing && existingPaper) {
        await paperService.updatePaper(existingPaper.id, paperData);
        Alert.alert('Success', 'Paper updated successfully');
      } else {
        await paperService.addPaper(paperData);
        Alert.alert('Success', 'Paper added successfully');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save paper. Make sure Firebase is configured.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <Text style={styles.label}>
          Title <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., TEF Compréhension Orale - Niveau B1"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>
          Description <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe what this paper covers..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>
          Category <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.filter(c => c !== 'Tous').map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipSelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Difficulty Level</Text>
        <View style={styles.difficultyRow}>
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.difficultyBtn,
                difficulty === diff && styles.difficultyBtnSelected,
              ]}
              onPress={() => setDifficulty(diff)}
            >
              <Text
                style={[
                  styles.difficultyBtnText,
                  difficulty === diff && styles.difficultyBtnTextSelected,
                ]}
              >
                {diff}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Questions Count</Text>
            <TextInput
              style={styles.input}
              value={questionsCount}
              onChangeText={setQuestionsCount}
              keyboardType="numeric"
              placeholder="25"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <Text style={styles.label}>Thumbnail URL (optional)</Text>
        <TextInput
          style={styles.input}
          value={thumbnail}
          onChangeText={setThumbnail}
          placeholder="https://example.com/image.jpg"
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
        />

        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Premium Content</Text>
            <Text style={styles.switchDescription}>
              Requires subscription to access
            </Text>
          </View>
          <Switch
            value={isPremium}
            onValueChange={setIsPremium}
            trackColor={{ false: Colors.disabled, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : isEditing ? 'Update Paper' : 'Create Paper'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={styles.questionsButton}
            onPress={() => navigation.navigate('ManageQuestions', { paper: existingPaper })}
          >
            <Text style={styles.questionsButtonText}>Manage Questions</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  difficultyBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  difficultyBtnSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  difficultyBtnText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  difficultyBtnTextSelected: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  switchLabel: {
    flex: 1,
  },
  switchDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionsButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  questionsButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
