import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'All Products' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}

function TabBarIcon({ label, focused }: { label: string; focused: boolean }) {
  const iconMap: { [key: string]: string } = {
    HomeTab: '🏠',
    ProductsTab: '🛍️',
    CartTab: '🛒',
    ProfileTab: '👤',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={styles.tabIconText}>{iconMap[label]}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label.replace('Tab', '')}
      </Text>
    </View>
  );
}

function CartTabIcon({ focused }: { focused: boolean }) {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <View style={styles.tabIcon}>
      <View>
        <Text style={styles.tabIconText}>🛒</Text>
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Cart</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="HomeTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="ProductsTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="ProfileTab" focused={focused} />,
          tabBarLabel: () => null,
          headerShown: true,
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
