import React from 'react';
import { View, Text, Button } from 'react-native';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to your Digital Twin</Text>
      <Button title="Start Chatting" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}