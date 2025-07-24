import React from 'react';
import { Button, FlatList, TextInput, View } from 'react-native';
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
    <View style={{ flex: 1, padding: 10 }}>
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