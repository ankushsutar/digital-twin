import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { openAIService } from '../../services/openai';
import { useDigitalTwinStore } from '../../store/digitalTwinStore';

export default function InsightsScreen() {
  const { profile, moodHistory, chatHistory, getMoodTrend, getPersonalityInsights } = useDigitalTwinStore();
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, [profile, moodHistory, chatHistory]);

  const loadInsights = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const personalityInsights = await openAIService.generatePersonalityInsights(profile);
      setInsights(personalityInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
      // Fallback to store insights
      setInsights(getPersonalityInsights());
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodTrendData = () => {
    const trend = getMoodTrend();
    const recentMoods = moodHistory.slice(-7);
    
    return {
      trend,
      recentMoods,
      average: trend.average,
      totalEntries: moodHistory.length,
    };
  };

  const getChatStats = () => {
    const totalMessages = chatHistory.reduce((sum, session) => sum + session.messages.length, 0);
    const totalSessions = chatHistory.length;
    const avgMessagesPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;
    
    return {
      totalMessages,
      totalSessions,
      avgMessagesPerSession,
    };
  };

  const getPersonalitySummary = () => {
    if (!profile) return null;

    const { personality, settings } = profile;
    
    return {
      traits: personality.traits.join(', '),
      communicationStyle: personality.communicationStyle,
      interests: personality.interests.join(', '),
      responseLength: settings.responseLength,
      formality: settings.formality,
    };
  };

  const renderPersonalityCard = () => {
    const summary = getPersonalitySummary();
    if (!summary) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={24} color="#667eea" />
          <Text style={styles.cardTitle}>Your Digital Twin</Text>
        </View>
        
        <View style={styles.personalityGrid}>
          <View style={styles.personalityItem}>
            <Text style={styles.personalityLabel}>Traits</Text>
            <Text style={styles.personalityValue}>{summary.traits}</Text>
          </View>
          
          <View style={styles.personalityItem}>
            <Text style={styles.personalityLabel}>Style</Text>
            <Text style={styles.personalityValue}>{summary.communicationStyle}</Text>
          </View>
          
          <View style={styles.personalityItem}>
            <Text style={styles.personalityLabel}>Interests</Text>
            <Text style={styles.personalityValue}>{summary.interests}</Text>
          </View>
          
          <View style={styles.personalityItem}>
            <Text style={styles.personalityLabel}>Response</Text>
            <Text style={styles.personalityValue}>{summary.responseLength}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMoodInsights = () => {
    const { trend, recentMoods, totalEntries } = getMoodTrendData();
    
    if (totalEntries === 0) {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={24} color="#667eea" />
            <Text style={styles.cardTitle}>Mood Insights</Text>
          </View>
          <Text style={styles.emptyText}>
            Start tracking your mood to see insights here!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="heart" size={24} color="#667eea" />
          <Text style={styles.cardTitle}>Mood Insights</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalEntries}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{trend.average.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Intensity</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'}
            </Text>
            <Text style={styles.statLabel}>Trend</Text>
          </View>
        </View>

        {trend.trend !== 'stable' && (
          <View style={styles.trendInsight}>
            <Text style={styles.trendText}>
              Your mood is {trend.trend === 'up' ? 'improving' : 'declining'} over time.
              {trend.trend === 'down' && ' Consider talking to your Digital Twin about what\'s on your mind.'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderChatInsights = () => {
    const stats = getChatStats();
    
    if (stats.totalSessions === 0) {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="chatbubbles" size={24} color="#667eea" />
            <Text style={styles.cardTitle}>Chat Insights</Text>
          </View>
          <Text style={styles.emptyText}>
            Start chatting with your Digital Twin to see insights here!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="chatbubbles" size={24} color="#667eea" />
          <Text style={styles.cardTitle}>Chat Insights</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalMessages}</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.avgMessagesPerSession}</Text>
            <Text style={styles.statLabel}>Avg/Session</Text>
          </View>
        </View>

        <View style={styles.insightTextContainer}>
          <Text style={styles.insightLabel}>
            You're actively engaging with your Digital Twin! 
            {stats.avgMessagesPerSession > 10 && ' You tend to have deep conversations.'}
          </Text>
        </View>
      </View>
    );
  };

  const renderPersonalityInsights = () => {
    if (insights.length === 0) {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={24} color="#667eea" />
            <Text style={styles.cardTitle}>AI Insights</Text>
          </View>
          <Text style={styles.emptyText}>
            {isLoading ? 'Analyzing your patterns...' : 'Start using the app to see AI-generated insights!'}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bulb" size={24} color="#667eea" />
          <Text style={styles.cardTitle}>AI Insights</Text>
        </View>
        
        <View style={styles.insightsList}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights & Analytics</Text>
        <Text style={styles.headerSubtitle}>
          Discover patterns in your behavior and mood
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPersonalityCard()}
        {renderMoodInsights()}
        {renderChatInsights()}
        {renderPersonalityInsights()}
        
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
  header: {
    padding: 20,
    paddingTop: 10,
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
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  personalityGrid: {
    gap: 12,
  },
  personalityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  personalityLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  personalityValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  trendInsight: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  insightTextContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  insightLabel: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 100,
  },
}); 