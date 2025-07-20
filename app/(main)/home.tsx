import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { openAIService } from '../../services/openai';
import { useAuthStore } from '../../store/authStore';
import { useDigitalTwinStore } from '../../store/digitalTwinStore';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { profile, getMoodTrend, getPersonalityInsights, loadingState, initializeProfile } = useDigitalTwinStore();
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  
  const [moodTrend, setMoodTrend] = useState(() => {
    try {
      return getMoodTrend();
    } catch (error) {
      return { average: 5, trend: 'stable' as const };
    }
  });
  
  const [insights, setInsights] = useState<string[]>(() => {
    try {
      return getPersonalityInsights();
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    if (!profile && user) {
      initializeProfile(user.id);
    }
    setIsApiConfigured(openAIService.isApiConfigured());
  }, [profile, user]);

  useEffect(() => {
    try {
      setMoodTrend(getMoodTrend());
      setInsights(getPersonalityInsights());
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, [profile]);

  const getMoodColor = () => {
    if (!moodTrend || !moodTrend.trend) return '#667eea';
    if (moodTrend.trend === 'up') return '#4CAF50';
    if (moodTrend.trend === 'down') return '#FF9800';
    return '#667eea';
  };

  const handleNavigation = (screen: string) => {
    try {
      router.push(`/(main)/${screen}` as any);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate. Please try again.');
    }
  };

  const getUserGreeting = () => {
    try {
      if (user?.name) return user.name;
      if (user?.email) return user.email.split('@')[0];
      return 'there';
    } catch (error) {
      return 'there';
    }
  };

  if (loadingState === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="person" size={48} color="#667eea" />
          <Text style={styles.loadingText}>Setting up your Digital Twin...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Digital Twin</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => handleNavigation('profile')}
        >
          <Ionicons name="person-circle" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Demo Mode Warning */}
        {!isApiConfigured && (
          <View style={styles.demoBanner}>
            <Ionicons name="information-circle" size={20} color="#667eea" />
            <Text style={styles.demoText}>Demo Mode - Using mock responses</Text>
          </View>
        )}

        {/* Main Action Card */}
        <View style={styles.mainActionCard}>
          <View style={styles.mainActionContent}>
            <View style={styles.mainActionText}>
              <Text style={styles.mainActionTitle}>Start a Conversation</Text>
              <Text style={styles.mainActionSubtitle}>
                Chat with your personalized AI companion
              </Text>
            </View>
            <TouchableOpacity
              style={styles.mainActionButton}
              onPress={() => handleNavigation('chat')}
            >
              <Ionicons name="chatbubbles" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: getMoodColor() + '20' }]}>
              <Ionicons name="heart" size={20} color={getMoodColor()} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{moodTrend.average.toFixed(1)}/10</Text>
              <Text style={styles.statLabel}>Mood</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="chatbubble" size={20} color="#4CAF50" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FF9800' + '20' }]}>
              <Ionicons name="bulb" size={20} color="#FF9800" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{insights.length}</Text>
              <Text style={styles.statLabel}>Insights</Text>
            </View>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          {/* Primary Features Row */}
          <View style={styles.featureRow}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => handleNavigation('mood')}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#ff6b6b' + '20' }]}>
                <Ionicons name="heart" size={28} color="#ff6b6b" />
              </View>
              <Text style={styles.featureTitle}>Track Mood</Text>
              <Text style={styles.featureSubtitle}>Log your emotions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => handleNavigation('personality')}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Ionicons name="person" size={28} color="#4CAF50" />
              </View>
              <Text style={styles.featureTitle}>Personality</Text>
              <Text style={styles.featureSubtitle}>Customize AI</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Features Row */}
          <View style={styles.featureRow}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => handleNavigation('insights')}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#FF9800' + '20' }]}>
                <Ionicons name="analytics" size={28} color="#FF9800" />
              </View>
              <Text style={styles.featureTitle}>Insights</Text>
              <Text style={styles.featureSubtitle}>View analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => handleNavigation('sessions')}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#9C27B0' + '20' }]}>
                <Ionicons name="time" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.featureTitle}>History</Text>
              <Text style={styles.featureSubtitle}>Past conversations</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Insight */}
        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest Insight</Text>
            <View style={styles.insightCard}>
              <Ionicons name="bulb" size={20} color="#FF9800" />
              <Text style={styles.insightText}>{insights[0]}</Text>
            </View>
          </View>
        )}

        {/* Setup Prompt */}
        {!profile && (
          <View style={styles.setupCard}>
            <View style={styles.setupContent}>
              <Ionicons name="person-circle" size={48} color="#667eea" />
              <Text style={styles.setupTitle}>Set Up Your AI</Text>
              <Text style={styles.setupText}>
                Customize your Digital Twin's personality to get the most out of your conversations.
              </Text>
              <TouchableOpacity
                style={styles.setupButton}
                onPress={() => handleNavigation('personality')}
              >
                <Text style={styles.setupButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  demoText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 8,
    fontWeight: '500',
  },
  mainActionCard: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  mainActionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainActionText: {
    flex: 1,
  },
  mainActionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  mainActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  setupCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  setupContent: {
    alignItems: 'center',
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  setupText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  setupButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
}); 