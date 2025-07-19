const fs = require('fs');
const path = require('path');

// Change this to wherever you want the project created
const projectRoot = path.join(__dirname, './');

const folders = [
  'assets',
  'components',
  'screens',
  'services',
  'store',
  'utils',
];

const filesWithContent = {
  'App.tsx': `
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
`.trim(),

  'components/ChatBubble.tsx': `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
}

export default function ChatBubble({ text, isUser }: ChatBubbleProps) {
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  ai: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
  },
});
`.trim(),

  'components/Header.tsx': `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digital Twin Me</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#4B88A2',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
`.trim(),

  'screens/OnboardingScreen.tsx': `
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
`.trim(),

  'screens/ChatScreen.tsx': `
import React from 'react';
import { View, TextInput, Button, FlatList } from 'react-native';
import ChatBubble from '../components/ChatBubble';

export default function ChatScreen() {
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<{ text: string, isUser: boolean }[]>([]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ChatBubble text={item.text} isUser={item.isUser} />}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Ask something..."
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
`.trim(),

  'screens/SettingsScreen.tsx': `
import React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings will be here</Text>
    </View>
  );
}
`.trim(),

  'services/openai.ts': `
import axios from 'axios';

const OPENAI_API_KEY = 'your-openai-api-key';

export async function askGPT(prompt: string) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: \`Bearer \${OPENAI_API_KEY}\`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}
`.trim(),

  'services/supabase.ts': `
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
`.trim(),

  'store/memoryStore.ts': `
import { create } from 'zustand';

interface MemoryState {
  mood: string;
  latestEntry: string;
  setMood: (mood: string) => void;
  setLatestEntry: (entry: string) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  mood: 'neutral',
  latestEntry: '',
  setMood: (mood) => set({ mood }),
  setLatestEntry: (entry) => set({ latestEntry: entry }),
}));
`.trim(),

  'utils/prompts.ts': `
export function generatePrompt(userInput: string, mood: string, latestEntry: string) {
  return \`You are Ankush's AI twin. You think and respond like him: calm, logical, curious, and caring.
Current mood: \${mood}
Recent memory: \${latestEntry}
User asked: \${userInput}\`;
}
`.trim(),
};

// Create folders
folders.forEach(folder => {
  const folderPath = path.join(projectRoot, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log('📁 Created folder:', folderPath);
  }
});

// Create files with content
Object.entries(filesWithContent).forEach(([relativePath, content]) => {
  const fullPath = path.join(projectRoot, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('📄 Created file:', fullPath);
});

console.log('\n✅ Project initialized at:', projectRoot);
