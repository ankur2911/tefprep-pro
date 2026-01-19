import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SettingsScreen({ navigation }: Props) {
  const { theme, isDarkMode, setTheme, colors } = useTheme();

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Customize your app experience
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APPEARANCE
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Theme
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Choose your preferred theme
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === 'system' && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => handleThemeChange('system')}
          >
            <View style={styles.themeOptionContent}>
              <Text style={[styles.themeOptionIcon, theme === 'system' && { color: colors.primary }]}>
                📱
              </Text>
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: colors.textPrimary }]}>
                  System
                </Text>
                <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>
                  Follow device settings
                </Text>
              </View>
            </View>
            {theme === 'system' && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === 'light' && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <View style={styles.themeOptionContent}>
              <Text style={[styles.themeOptionIcon, theme === 'light' && { color: colors.primary }]}>
                ☀️
              </Text>
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: colors.textPrimary }]}>
                  Light
                </Text>
                <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>
                  Bright and clear
                </Text>
              </View>
            </View>
            {theme === 'light' && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === 'dark' && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <View style={styles.themeOptionContent}>
              <Text style={[styles.themeOptionIcon, theme === 'dark' && { color: colors.primary }]}>
                🌙
              </Text>
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: colors.textPrimary }]}>
                  Dark
                </Text>
                <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>
                  Easy on the eyes
                </Text>
              </View>
            </View>
            {theme === 'dark' && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
        <Text style={[styles.infoTitle, { color: colors.primary }]}>💡 About Themes</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          • <Text style={{ fontWeight: '600' }}>System</Text> - Automatically switches between light and dark based on your device settings{'\n'}
          • <Text style={{ fontWeight: '600' }}>Light</Text> - Always uses light mode{'\n'}
          • <Text style={{ fontWeight: '600' }}>Dark</Text> - Always uses dark mode
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeOptionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  themeOptionText: {
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeOptionSubtitle: {
    fontSize: 13,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
