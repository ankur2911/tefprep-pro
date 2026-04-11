module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
  globals: {
    __DEV__: true,
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@invertase/.*|react-native-purchases)',
  ],
  moduleNameMapper: {
    // expo-constants is nested under expo's own node_modules (not top-level)
    '^expo-constants$': '<rootDir>/node_modules/expo/node_modules/expo-constants',
  },
};
