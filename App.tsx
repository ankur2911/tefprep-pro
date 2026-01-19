import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import ThemedStatusBar from './src/components/ThemedStatusBar';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <AppNavigator />
            <ThemedStatusBar />
          </NavigationContainer>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
