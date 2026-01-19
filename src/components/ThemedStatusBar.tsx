import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';

export default function ThemedStatusBar() {
  const { isDarkMode } = useTheme();

  // In dark mode, use light text (light-content)
  // In light mode, use dark text (dark-content)
  return <StatusBar style={isDarkMode ? 'light' : 'dark'} />;
}
