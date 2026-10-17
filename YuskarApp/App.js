import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import PackageDeliveryScreen from './src/screens/PackageDeliveryScreen';
import RestaurantsScreen from './src/screens/RestaurantsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DriverScreen from './src/screens/DriverScreen';
import AdminScreen from './src/screens/AdminScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PackageDelivery" component={PackageDeliveryScreen} options={{ title: 'Ohereza Ipaki' }} />
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} options={{ title: 'Hotels & Restaurants' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Kwishyura' }} />
        <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Gukurikirana Shoferi' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Umwirondoro & Amateka' }} />
        <Stack.Screen name="Driver" component={DriverScreen} options={{ title: 'Shoferi Dashboard' }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Control Panel' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Kuganira na Shoferi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}