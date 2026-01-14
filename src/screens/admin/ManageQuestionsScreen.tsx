import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../../utils/colors';
import { Paper, Question } from '../../types';
import { paperService } from '../../services/paperService';
import { MOCK_QUESTIONS } from '../../utils/mockData';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { paper: Paper } }, 'params'>;
};

export default function ManageQuestionsScreen({ navigation, route }: Props) {
  const { paper } = route.params;
  const [questions, setQuestions] = useState<Question[]>(
    paper.questions || MOCK_QUESTIONS[paper.id] || []
  );
  const [isAdding, setIsAdding] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');

  const handleAddQuestion = () => {
    if (!newQuestion || !option1 || !option2) {
      Alert.alert('Error', 'Please fill in the question and at least 2 options');
      return;
    }

    const options = [option1, option2, option3, option4].filter(o => o.trim() !== '');

    const question: Question = {
      id: `q${paper.id}_${questions.length + 1}`,
      question: newQuestion,
      options,
      correctAnswer,
      explanation: explanation || undefined,
    };

    const updatedQuestions = [...questions, question];
    setQuestions(updatedQuestions);

    // Reset form
    setNewQuestion('');
    setOption1('');
    setOption2('');
    setOption3('');
    setOption4('');
    setCorrectAnswer(0);
    setExplanation('');
    setIsAdding(false);

    Alert.alert('Success', 'Question added! Remember to save all questions.');
  };

  const handleDeleteQuestion = (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setQuestions(questions.filter(q => q.id !== questionId));
          },
        },
      ]
    );
  };

  const handleSaveAll = async () => {
    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question');
      return;
    }

    try {
      await paperService.addQuestionsToPaper(paper.id, questions);
      Alert.alert('Success', `${questions.length} questions saved successfully!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save questions. Make sure Firebase is configured.');
      console.error(error);
    }
  };

  const renderQuestion = ({ item, index }: { item: Question; index: number }) => (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>Question {index + 1}</Text>
        <TouchableOpacity onPress={() => handleDeleteQuestion(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.questionText}>{item.question}</Text>

      {item.options.map((option, optionIndex) => (
        <View
          key={optionIndex}
          style={[
            styles.optionRow,
            optionIndex === item.correctAnswer && styles.correctOption,
          ]}
        >
          <Text style={styles.optionLabel}>{String.fromCharCode(65 + optionIndex)}.</Text>
          <Text style={styles.optionText}>{option}</Text>
          {optionIndex === item.correctAnswer && (
            <Text style={styles.correctBadge}>✓ Correct</Text>
          )}
        </View>
      ))}

      {item.explanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationLabel}>Explanation:</Text>
          <Text style={styles.explanationText}>{item.explanation}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Questions</Text>
        <Text style={styles.headerSubtitle}>{paper.title}</Text>
        <Text style={styles.questionCount}>{questions.length} questions</Text>
      </View>

      {!isAdding ? (
        <>
          <FlatList
            data={questions}
            renderItem={renderQuestion}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No questions yet</Text>
                <Text style={styles.emptySubtext}>Add your first question below</Text>
              </View>
            }
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAdding(true)}
            >
              <Text style={styles.addButtonText}>+ Add Question</Text>
            </TouchableOpacity>

            {questions.length > 0 && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAll}
              >
                <Text style={styles.saveButtonText}>Save All Questions</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Question</Text>

          <Text style={styles.label}>Question</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newQuestion}
            onChangeText={setNewQuestion}
            placeholder="Enter the question..."
            placeholderTextColor={Colors.textSecondary}
            multiline
          />

          <Text style={styles.label}>Option 1 (Required)</Text>
          <TextInput
            style={styles.input}
            value={option1}
            onChangeText={setOption1}
            placeholder="First option"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Option 2 (Required)</Text>
          <TextInput
            style={styles.input}
            value={option2}
            onChangeText={setOption2}
            placeholder="Second option"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Option 3 (Optional)</Text>
          <TextInput
            style={styles.input}
            value={option3}
            onChangeText={setOption3}
            placeholder="Third option"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Option 4 (Optional)</Text>
          <TextInput
            style={styles.input}
            value={option4}
            onChangeText={setOption4}
            placeholder="Fourth option"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Correct Answer</Text>
          <View style={styles.correctAnswerRow}>
            {[0, 1, 2, 3].map((index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.correctAnswerBtn,
                  correctAnswer === index && styles.correctAnswerBtnSelected,
                ]}
                onPress={() => setCorrectAnswer(index)}
              >
                <Text
                  style={[
                    styles.correctAnswerBtnText,
                    correctAnswer === index && styles.correctAnswerBtnTextSelected,
                  ]}
                >
                  {String.fromCharCode(65 + index)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Explanation (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={explanation}
            onChangeText={setExplanation}
            placeholder="Explain why this is the correct answer..."
            placeholderTextColor={Colors.textSecondary}
            multiline
          />

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setIsAdding(false);
                // Reset form
                setNewQuestion('');
                setOption1('');
                setOption2('');
                setOption3('');
                setOption4('');
                setCorrectAnswer(0);
                setExplanation('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formButton, styles.submitButton]}
              onPress={handleAddQuestion}
            >
              <Text style={styles.submitButtonText}>Add Question</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  questionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
  },
  list: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
    fontWeight: '500',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  correctOption: {
    backgroundColor: '#D1FAE5',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 8,
    width: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  correctBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  explanationBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  footer: {
    padding: 16,
    gap: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 22,
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
    height: 80,
    textAlignVertical: 'top',
  },
  correctAnswerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  correctAnswerBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  correctAnswerBtnSelected: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  correctAnswerBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  correctAnswerBtnTextSelected: {
    color: Colors.textInverse,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 32,
  },
  formButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
