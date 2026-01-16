import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Paper, Question } from '../types';
import { MOCK_QUESTIONS } from '../utils/mockData';
import { Colors } from '../utils/colors';
import { paperService } from '../services/paperService';
import AudioPlayer from '../components/AudioPlayer';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { paper: Paper } }, 'params'>;
};

export default function TestScreen({ navigation, route }: Props) {
  const { paper } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(paper.duration * 60);
  const [isFocused, setIsFocused] = useState(true);
  const handleSubmitRef = useRef<(() => void) | null>(null);
  const [canNavigate, setCanNavigate] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  // Listen for screen focus/blur to stop audio when navigating away
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('🎵 TestScreen focused');
      setIsFocused(true);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('🎵 TestScreen blurred - stopping audio');
      setIsFocused(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  // Prevent navigation away from test without confirmation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // If we've already confirmed or the test is being submitted, allow navigation
      if (canNavigate) {
        return;
      }

      // Prevent default navigation behavior
      e.preventDefault();

      // Show confirmation dialog
      Alert.alert(
        'Quit Test?',
        'Are you sure you want to quit this test? Your progress will be lost and the test will be reset.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Quit',
            style: 'destructive',
            onPress: () => {
              // Allow navigation and reset test
              setCanNavigate(true);
              // Navigate back after state update
              setTimeout(() => {
                navigation.dispatch(e.data.action);
              }, 0);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, canNavigate]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      // Try to load from Firebase first
      const firebaseQuestions = await paperService.getQuestionsForPaper(paper.id);

      if (firebaseQuestions.length > 0) {
        setQuestions(firebaseQuestions);
        console.log(`Loaded ${firebaseQuestions.length} questions from Firebase`);
      } else {
        // Fallback to mock data
        const mockQuestions = MOCK_QUESTIONS[paper.id] || [];
        setQuestions(mockQuestions);
        console.log(`Using ${mockQuestions.length} mock questions`);
      }
    } catch (error) {
      console.error('Error loading questions, using mock data:', error);
      setQuestions(MOCK_QUESTIONS[paper.id] || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (handleSubmitRef.current) {
            handleSubmitRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const score = questions.reduce((total, question) => {
      return answers[question.id] === question.correctAnswer ? total + 1 : total;
    }, 0);

    // Calculate time spent (total time - remaining time)
    const timeSpent = (paper.duration * 60) - timeRemaining;

    // Allow navigation for test submission
    setCanNavigate(true);

    navigation.replace('TestResults', {
      paper,
      score,
      totalQuestions: questions.length,
      answers,
      questions,
      timeSpent,
    });
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Test?',
      'Are you sure you want to quit this test? Your progress will be lost and the test will be reset.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => {
            setCanNavigate(true);
            setTimeout(() => {
              navigation.navigate('Papers');
            }, 0);
          },
        },
      ]
    );
  };

  // Update ref whenever handleSubmit changes
  handleSubmitRef.current = handleSubmit;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No questions available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitButton}>
          <Text style={styles.quitButtonText}>Quit</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.progress}>
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {currentQuestion.audioUrl && (
          <AudioPlayer audioUrl={currentQuestion.audioUrl} autoPlay={false} isFocused={isFocused} />
        )}
        {console.log('🎵 Current question:', currentQuestion.id, 'Has audio:', !!currentQuestion.audioUrl)}

        <Text style={styles.question}>{currentQuestion.question}</Text>

        <View style={styles.options}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleSelectAnswer(index)}
              >
                <View
                  style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}
                >
                  {isSelected && <View style={styles.optionCircleInner} />}
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        {currentQuestionIndex === questions.length - 1 ? (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Test</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.error,
    minWidth: 60,
    alignItems: 'center',
  },
  quitButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerSpacer: {
    minWidth: 60,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progress: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 30,
    lineHeight: 28,
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F3E8FF',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: Colors.primary,
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
