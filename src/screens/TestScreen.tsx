import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Paper, Question } from '../types';
import { MOCK_QUESTIONS } from '../utils/mockData';
import { Colors } from '../utils/colors';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { paper: Paper } }, 'params'>;
};

export default function TestScreen({ navigation, route }: Props) {
  const { paper } = route.params;
  const [questions] = useState<Question[]>(MOCK_QUESTIONS[paper.id] || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(paper.duration * 60);
  const handleSubmitRef = useRef<() => void>();

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

    navigation.replace('TestResults', {
      paper,
      score,
      totalQuestions: questions.length,
      answers,
      questions,
    });
  };

  // Update ref whenever handleSubmit changes
  handleSubmitRef.current = handleSubmit;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No questions available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.progress}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
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
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
});
