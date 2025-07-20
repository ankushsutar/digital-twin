import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDigitalTwinStore } from '../../store/digitalTwinStore';
import { ChatSession } from '../../types/api';

export default function SessionsScreen() {
  const { chatHistory, currentSession, createNewSession } = useDigitalTwinStore();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const allSessions = currentSession && currentSession.messages.length > 0 
    ? [currentSession, ...chatHistory]
    : chatHistory;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSessionPreview = (session: ChatSession) => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (!lastMessage) return 'No messages yet';
    
    const preview = lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content;
    
    return `${lastMessage.role === 'user' ? 'You' : 'AI'}: ${preview}`;
  };

  const getMessageCount = (session: ChatSession) => {
    return session.messages.length;
  };

  const handleSessionPress = (session: ChatSession) => {
    // In a real app, you would navigate to the chat with this session
    Alert.alert(
      'Session Details',
      `Title: ${session.title}\nMessages: ${session.messages.length}\nCreated: ${formatDate(session.createdAt)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Open session:', session.id) }
      ]
    );
  };

  const handleNewSession = () => {
    createNewSession();
    Alert.alert('Success', 'New chat session created!');
  };

  const handleExportSession = (session: ChatSession) => {
    const exportData = {
      title: session.title,
      createdAt: session.createdAt.toISOString(),
      messages: session.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
    };

    // In a real app, you would implement actual export functionality
    console.log('Export data:', JSON.stringify(exportData, null, 2));
    Alert.alert('Export', 'Session export feature coming soon!');
  };

  const handleDeleteSession = (session: ChatSession) => {
    Alert.alert(
      'Delete Session',
      `Are you sure you want to delete "${session.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you would implement actual deletion
            console.log('Delete session:', session.id);
            Alert.alert('Success', 'Session deleted successfully!');
          }
        }
      ]
    );
  };

  const renderSessionItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => handleSessionPress(item)}
    >
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <Text style={styles.sessionDate}>
            {formatDate(item.createdAt)} • {formatTime(item.createdAt)}
          </Text>
        </View>
        <View style={styles.sessionActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleExportSession(item)}
          >
            <Ionicons name="download-outline" size={16} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteSession(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.sessionPreview}>
        {getSessionPreview(item)}
      </Text>
      
      <View style={styles.sessionFooter}>
        <View style={styles.messageCount}>
          <Ionicons name="chatbubble-outline" size={14} color="#666" />
          <Text style={styles.messageCountText}>
            {getMessageCount(item)} messages
          </Text>
        </View>
        {item.id === currentSession?.id && (
          <View style={styles.currentSessionBadge}>
            <Text style={styles.currentSessionText}>Current</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Chat Sessions</Text>
      <Text style={styles.emptyStateText}>
        Start chatting with your Digital Twin to see your conversation history here.
      </Text>
      <TouchableOpacity
        style={styles.startChatButton}
        onPress={handleNewSession}
      >
        <Text style={styles.startChatButtonText}>Start Your First Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Sessions</Text>
        <Text style={styles.headerSubtitle}>
          Your conversation history with your Digital Twin
        </Text>
        <TouchableOpacity
          style={styles.newSessionButton}
          onPress={handleNewSession}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.newSessionButtonText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {allSessions.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={allSessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          style={styles.sessionsList}
          contentContainerStyle={styles.sessionsContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  newSessionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sessionsList: {
    flex: 1,
  },
  sessionsContent: {
    padding: 16,
  },
  sessionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  sessionPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  currentSessionBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentSessionText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 