import React, { useState } from 'react';
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
import { Colors } from '../utils/colors';
import { uploadMockDataToFirebase, clearFirebaseData } from '../scripts/uploadMockData';
import { testFirebaseRules, getCurrentFirebaseRulesInfo } from '../scripts/testFirebaseRules';
import { syncCurrentUser, checkUserDocumentExists } from '../scripts/syncUsers';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/adminCheck';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function AdminScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    papersUploaded: number;
    questionsUploaded: number;
    errors?: number;
  } | null>(null);

  // Check if user is admin
  const userIsAdmin = isAdmin(user?.email);

  // If not admin, show access denied
  if (!userIsAdmin) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Text style={styles.accessDeniedIcon}>🚫</Text>
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          You do not have permission to access the Admin Panel.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUploadData = async () => {
    Alert.alert(
      'Upload Mock Data',
      'This will upload all 16 papers and their questions to Firebase.\n\n⏱️ This will take 2-3 minutes to avoid bandwidth limits.\n\nContinue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload',
          onPress: async () => {
            try {
              setUploading(true);
              setUploadResult(null);
              const result = await uploadMockDataToFirebase();
              setUploadResult({
                papersUploaded: result.papersUploaded,
                questionsUploaded: result.questionsUploaded,
                errors: result.errors,
              });

              if (result.errors && result.errors > 0) {
                Alert.alert(
                  'Upload Completed with Errors',
                  `✓ Papers: ${result.papersUploaded}\n✓ Questions: ${result.questionsUploaded}\n⚠️ Errors: ${result.errors}\n\nIf you see "Missing permissions" errors, you need to update your Firebase security rules.\n\nCheck the console for details.`,
                  [
                    {
                      text: 'View Instructions',
                      onPress: () => Alert.alert(
                        'Fix Firebase Rules',
                        'Go to Firebase Console → Firestore Database → Rules\n\nAdd this rule:\n\nmatch /papers/{paperId}/questions/{questionId} {\n  allow read: if true;\n  allow write: if request.auth != null;\n}\n\nSee FIREBASE_RULES_FIX.md for complete instructions.'
                      )
                    },
                    { text: 'OK' }
                  ]
                );
              } else {
                Alert.alert(
                  'Upload Successful!',
                  `✓ Uploaded ${result.papersUploaded} papers\n✓ Uploaded ${result.questionsUploaded} questions\n\nAll data is now in Firebase!`
                );
              }
            } catch (error: any) {
              console.error('Upload error:', error);
              const errorMsg = error?.message || 'Unknown error';
              Alert.alert(
                'Upload Failed',
                `Error: ${errorMsg}\n\nCheck the console for more details.`,
                [{ text: 'OK' }]
              );
            } finally {
              setUploading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear Firebase Data',
      'This will DELETE all papers and questions from Firebase. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearing(true);
              await clearFirebaseData();
              setUploadResult(null);
              Alert.alert('Success', 'All data cleared from Firebase');
            } catch (error) {
              console.error('Clear error:', error);
              Alert.alert('Error', 'Failed to clear data. Check console for details.');
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  const handleTestRules = async () => {
    try {
      setTesting(true);
      console.log('\n🔍 Starting Firebase rules test...\n');
      const result = await testFirebaseRules();

      if (result.questionWrite) {
        Alert.alert(
          '✓ Rules Test Passed',
          'All Firebase security rules are configured correctly!\n\nYou can now upload mock data without errors.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          '✗ Rules Test Failed',
          'Your Firebase rules are not configured correctly.\n\nThe questions subcollection cannot be written to.\n\nCheck the console for detailed instructions.',
          [
            {
              text: 'Show Fix',
              onPress: () => {
                getCurrentFirebaseRulesInfo();
                Alert.alert(
                  'Fix Instructions',
                  'Full instructions printed to console.\n\nGo to:\nFirebase Console → Firestore Database → Rules\n\nThen copy the rules from the console.',
                  [{ text: 'OK' }]
                );
              }
            },
            { text: 'OK' }
          ]
        );
      }
    } catch (error: any) {
      console.error('Test error:', error);
      Alert.alert('Test Error', error?.message || 'Unknown error');
    } finally {
      setTesting(false);
    }
  };

  const handleShowRules = () => {
    getCurrentFirebaseRulesInfo();
    Alert.alert(
      'Firebase Rules',
      'Complete Firebase security rules have been printed to the console.\n\nTo apply:\n\n1. Check the console\n2. Copy the rules\n3. Go to Firebase Console\n4. Firestore Database → Rules\n5. Paste and Publish',
      [{ text: 'OK' }]
    );
  };

  const handleSyncCurrentUser = async () => {
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    try {
      setSyncing(true);

      // Check if user document already exists
      const exists = await checkUserDocumentExists(user.uid);

      if (exists) {
        Alert.alert(
          'Already Synced',
          `Your user document already exists in Firestore.\n\nEmail: ${user.email}\nUID: ${user.uid.substring(0, 12)}...`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Sync user
      await syncCurrentUser(user.uid, user.email || '');

      Alert.alert(
        'Success!',
        `Your account has been synced to Firestore.\n\nYou can now:\n• View your account in User Management\n• Toggle test premium for yourself\n• Access all admin features`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Sync error:', error);
      Alert.alert('Error', error?.message || 'Failed to sync user');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtitle}>Manage Firebase Data</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnostics</Text>

        <TouchableOpacity
          style={[styles.diagnosticButton, syncing && styles.actionButtonDisabled]}
          onPress={handleSyncCurrentUser}
          disabled={uploading || clearing || testing || syncing}
        >
          {syncing ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>👤</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionButtonText}>Sync My Account to Firestore</Text>
                <Text style={[styles.actionButtonText, { fontSize: 11, opacity: 0.8, fontWeight: '400' }]}>
                  Required for User Management to see this user
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.diagnosticButton, testing && styles.actionButtonDisabled]}
          onPress={handleTestRules}
          disabled={uploading || clearing || testing || syncing}
        >
          {testing ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>🔍</Text>
              <Text style={styles.actionButtonText}>Test Firebase Rules</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={handleShowRules}
          disabled={uploading || clearing || testing || syncing}
        >
          <Text style={styles.actionButtonIcon}>📋</Text>
          <Text style={styles.actionButtonText}>Show Correct Rules</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity
          style={[styles.actionButton, uploading && styles.actionButtonDisabled]}
          onPress={handleUploadData}
          disabled={uploading || clearing || testing}
        >
          {uploading ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>📤</Text>
              <Text style={styles.actionButtonText}>Upload Mock Data to Firebase</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerButton, clearing && styles.actionButtonDisabled]}
          onPress={handleClearData}
          disabled={uploading || clearing || testing}
        >
          {clearing ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>🗑️</Text>
              <Text style={styles.actionButtonText}>Clear Firebase Data</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {uploadResult && (
        <View style={
          uploadResult.errors && uploadResult.errors > 0
            ? [styles.resultCard, styles.resultCardWarning]
            : styles.resultCard
        }>
          <Text style={styles.resultTitle}>
            {uploadResult.errors && uploadResult.errors > 0 ? '⚠️ Upload Result' : '✓ Upload Result'}
          </Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Papers Uploaded:</Text>
            <Text style={styles.resultValue}>{String(uploadResult.papersUploaded)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Questions Uploaded:</Text>
            <Text style={styles.resultValue}>{String(uploadResult.questionsUploaded)}</Text>
          </View>
          {uploadResult.errors && uploadResult.errors > 0 && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Errors:</Text>
              <Text style={[styles.resultValue, { color: Colors.error }]}>
                {String(uploadResult.errors)}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How to Use</Text>
        <Text style={styles.infoText}>
          1. <Text style={{ fontWeight: '600' }}>Sync My Account</Text> - Creates your user document in Firestore (required for User Management to see you)
        </Text>
        <Text style={styles.infoText}>
          2. <Text style={{ fontWeight: '600' }}>Test Firebase Rules</Text> - Checks if your Firestore security rules are configured correctly
        </Text>
        <Text style={styles.infoText}>
          3. <Text style={{ fontWeight: '600' }}>Upload Mock Data</Text> - Uploads 16+ practice papers with questions to Firebase (takes 2-3 minutes)
        </Text>
        <Text style={[styles.infoText, { marginTop: 8, fontStyle: 'italic', opacity: 0.8 }]}>
          Note: Other users need to login once to appear in User Management
        </Text>
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
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
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
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  dangerButton: {
    backgroundColor: Colors.error,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  diagnosticButton: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  infoButton: {
    backgroundColor: Colors.textSecondary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultCardWarning: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warning + '10',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  infoCard: {
    backgroundColor: Colors.primary + '15',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.background,
  },
  accessDeniedIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  accessDeniedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
