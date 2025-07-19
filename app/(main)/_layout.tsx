import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'rgba(102, 126, 234, 0.4)',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.4)',
          paddingBottom: insets.bottom,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 50 + insets.bottom,
          shadowColor: '#667eea',
          shadowOffset: {
            width: 0,
            height: -6,
          },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 25,
          // Glassmorphism effect
          backdropFilter: 'blur(25px)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={focused ? size + 2 : size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "chatbubbles" : "chatbubbles-outline"} 
              size={focused ? size + 2 : size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={focused ? size + 2 : size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
} 