import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Paper, Question } from '../types';
import { Colors } from '../utils/colors';
import { useAuth } from '../context/AuthContext';
import { testAttemptService } from '../services/testAttemptService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{
    params: {
      paper: Paper;
      score: number;
      totalQuestions: number;
      answers: { [questionId: string]: number };
      questions: Question[];
      timeSpent: number;
    };
  }, 'params'>;
};

export default function TestResultsScreen({ navigation, route }: Props) {
  const { paper, score, totalQuestions, answers, questions, timeSpent } = route.params;
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const percentage = ((score / totalQuestions) * 100).toFixed(1);
  const passed = parseFloat(percentage) >= 60;

  // Play sound effect based on result
  useEffect(() => {
    const playResultSound = async () => {
      try {
        // Check if sound effects are enabled
        const soundEnabled = await AsyncStorage.getItem('soundEffectsEnabled');
        if (soundEnabled === 'false') {
          return; // Sound effects disabled
        }

        // Configure audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Play success or failure sound based on result
        const soundUrl = passed
          ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' // Success chime
          : 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'; // Failure buzz

        const { sound } = await Audio.Sound.createAsync(
          { uri: soundUrl },
          { shouldPlay: true }
        );

        // Unload sound after playing
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.error('Error playing result sound:', error);
      }
    };

    playResultSound();
  }, [passed]);

  // Save test attempt to Firebase
  useEffect(() => {
    const saveAttempt = async () => {
      if (!user || saved) return;

      try {
        await testAttemptService.saveAttempt({
          userId: user.uid,
          paperId: paper.id,
          score,
          totalQuestions,
          timeSpent,
          answers,
          completedAt: new Date(),
        });
        setSaved(true);
        console.log('Test attempt saved successfully');
      } catch (error) {
        console.error('Error saving test attempt:', error);
      }
    };

    saveAttempt();
  }, [user, saved]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Completed!</Text>
        <View style={[styles.scoreCard, passed ? styles.scoreCardPass : styles.scoreCardFail]}>
          <Text style={styles.scoreText}>
            {score} / {totalQuestions}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
        <Text style={[styles.status, passed ? styles.statusPass : styles.statusFail]}>
          {passed ? '✓ Passed' : '✗ Not Passed'}
        </Text>
      </View>

      <View style={styles.paperInfo}>
        <Text style={styles.paperTitle}>{paper.title}</Text>
        <Text style={styles.paperCategory}>{paper.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question Review</Text>
        {questions.map((question, index) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <View
                  style={[
                    styles.resultBadge,
                    isCorrect ? styles.correctBadge : styles.incorrectBadge,
                  ]}
                >
                  <Text style={styles.resultBadgeText}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Text>
                </View>
              </View>

              <Text style={styles.questionText}>{question.question}</Text>

              {userAnswer !== undefined && (
                <View style={styles.answerSection}>
                  <Text style={styles.answerLabel}>Your answer:</Text>
                  <Text
                    style={[
                      styles.answerText,
                      isCorrect ? styles.correctAnswer : styles.incorrectAnswer,
                    ]}
                  >
                    {question.options[userAnswer]}
                  </Text>
                </View>
              )}

              {!isCorrect && (
                <View style={styles.answerSection}>
                  <Text style={styles.answerLabel}>Correct answer:</Text>
                  <Text style={[styles.answerText, styles.correctAnswer]}>
                    {question.options[question.correctAnswer]}
                  </Text>
                </View>
              )}

              {question.explanation && (
                <View style={styles.explanation}>
                  <Text style={styles.explanationLabel}>Explanation:</Text>
                  <Text style={styles.explanationText}>{question.explanation}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.retryButton]}
          onPress={() => navigation.replace('Test', { paper })}
        >
          <Text style={styles.buttonText}>Retry Test</Text>
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
    backgroundColor: Colors.surface,
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  scoreCard: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCardPass: {
    backgroundColor: '#D1FAE5',
    borderWidth: 4,
    borderColor: Colors.success,
  },
  scoreCardFail: {
    backgroundColor: '#FEE2E2',
    borderWidth: 4,
    borderColor: Colors.error,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  percentageText: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
  },
  statusPass: {
    color: Colors.success,
  },
  statusFail: {
    color: Colors.error,
  },
  paperInfo: {
    padding: 20,
    backgroundColor: Colors.surface,
    marginTop: 12,
  },
  paperTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  paperCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  correctBadge: {
    backgroundColor: '#D1FAE5',
  },
  incorrectBadge: {
    backgroundColor: '#FEE2E2',
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  answerSection: {
    marginTop: 8,
  },
  answerLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '500',
  },
  correctAnswer: {
    color: Colors.success,
  },
  incorrectAnswer: {
    color: Colors.error,
  },
  explanation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
