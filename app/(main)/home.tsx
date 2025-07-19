import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import { useDigitalTwinStore } from '../../store/digitalTwinStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { profile, getMoodTrend, getPersonalityInsights, loadingState } = useDigitalTwinStore();
  
  // Safely get mood trend and insights with error handling
  const [moodTrend, setMoodTrend] = useState(() => {
    try {
      return getMoodTrend();
    } catch (error) {
      console.error('Error getting mood trend:', error);
      return { average: 5, trend: 'stable' as const };
    }
  });
  
  const [insights, setInsights] = useState<string[]>(() => {
    try {
      return getPersonalityInsights();
    } catch (error) {
      console.error('Error getting insights:', error);
      return [];
    }
  });

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Update mood trend and insights when store changes
  useEffect(() => {
    try {
      setMoodTrend(getMoodTrend());
      setInsights(getPersonalityInsights());
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, [profile]);

  const getMoodEmoji = () => {
    if (!moodTrend || !moodTrend.trend) return '😐';
    if (moodTrend.trend === 'up') return '😊';
    if (moodTrend.trend === 'down') return '😔';
    return '😐';
  };

  const getMoodColor = (): [string, string] => {
    if (!moodTrend || !moodTrend.trend) return ['#2196F3', '#64B5F6'];
    if (moodTrend.trend === 'up') return ['#4CAF50', '#81C784'];
    if (moodTrend.trend === 'down') return ['#FF9800', '#FFB74D'];
    return ['#2196F3', '#64B5F6'];
  };

  const getMoodDescription = () => {
    if (!moodTrend || !moodTrend.trend) return 'Welcome to your Digital Twin!';
    if (moodTrend.trend === 'up') return 'You\'re feeling great!';
    if (moodTrend.trend === 'down') return 'Let\'s talk about it';
    return 'Stable mood today';
  };

  const getMoodAverage = () => {
    if (!moodTrend || !moodTrend.average) return '0.0';
    return moodTrend.average.toFixed(1);
  };

  const getMoodTrendText = () => {
    if (!moodTrend || !moodTrend.trend) return '→ New';
    if (moodTrend.trend === 'up') return '↗ Improving';
    if (moodTrend.trend === 'down') return '↘ Declining';
    return '→ Stable';
  };

  const handleQuickAction = (action: string) => {
    try {
      switch (action) {
        case 'chat':
          router.push('/chat');
          break;
        case 'insights':
          Alert.alert('Insights', 'Analytics feature coming soon!');
          break;
        case 'settings':
          router.push('/profile');
          break;
        case 'help':
          Alert.alert('Help', 'Support feature coming soon!');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate. Please try again.');
    }
  };

  const quickActions = [
    {
      id: 'chat',
      icon: 'chatbubbles',
      title: 'Start Chat',
      subtitle: 'Talk to your AI',
      color: '#667eea',
      gradient: ['#667eea', '#764ba2'] as [string, string],
    },
    {
      id: 'insights',
      icon: 'analytics',
      title: 'Insights',
      subtitle: 'View analytics',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#81C784'] as [string, string],
    },
    {
      id: 'settings',
      icon: 'settings',
      title: 'Settings',
      subtitle: 'Customize app',
      color: '#FF9800',
      gradient: ['#FF9800', '#FFB74D'] as [string, string],
    },
    {
      id: 'help',
      icon: 'help-circle',
      title: 'Help',
      subtitle: 'Get support',
      color: '#9C27B0',
      gradient: ['#9C27B0', '#BA68C8'] as [string, string],
    },
  ];

  const getUserGreeting = () => {
    try {
      if (user?.name) return user.name;
      if (user?.email) return user.email.split('@')[0];
      return 'User';
    } catch (error) {
      console.error('Error getting user greeting:', error);
      return 'User';
    }
  };

  // Show loading spinner if store is loading
  if (loadingState === 'loading') {
    return <LoadingSpinner fullScreen text="Loading your Digital Twin..." />;
  }

  return (
    <View style={styles.container}>
      
      {/* Modern Header with Gradient Background */}
      <LinearGradient
        colors={['#E3F2FD', '#F3E5F5']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Digital Twin</Text>
              <Text style={styles.userName}>Hey, {getUserGreeting()} 👋</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => {
                try {
                  router.push('/profile');
                } catch (error) {
                  console.error('Navigation error:', error);
                  Alert.alert('Error', 'Unable to navigate to profile.');
                }
              }}
            >
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={20} color="#667eea" />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statusCardsRow}>
            <View style={styles.headerStatusCard}>
              <Ionicons name="heart" size={16} color="#667eea" />
              <Text style={styles.headerStatusValue}>{getMoodAverage()}/10</Text>
              <Text style={styles.headerStatusLabel}>Mood</Text>
            </View>
            <View style={styles.headerStatusCard}>
              <Ionicons name="chatbubbles" size={16} color="#4CAF50" />
              <Text style={styles.headerStatusValue}>24</Text>
              <Text style={styles.headerStatusLabel}>Chats</Text>
            </View>
            <View style={styles.headerStatusCard}>
              <Ionicons name="bulb" size={16} color="#FF9800" />
              <Text style={styles.headerStatusValue}>{insights.length}</Text>
              <Text style={styles.headerStatusLabel}>Insights</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modern Stats Cards Row */}
        <Animated.View 
          style={[
            styles.statsRow,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{getMoodTrendText().includes('Improving') ? '+12%' : getMoodTrendText().includes('Declining') ? '-8%' : '0%'}</Text>
            <Text style={styles.statLabel}>Mood Trend</Text>
            <View style={styles.statTrend}>
              <Ionicons name="calendar" size={14} color="#666" />
              <Text style={styles.statTrendText}>This week</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={20} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>2.5h</Text>
            <Text style={styles.statLabel}>Avg. Session</Text>
            <View style={styles.statTrend}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.statTrendText}>Per chat</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="analytics" size={20} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
            <View style={styles.statTrend}>
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.statTrendText}>AI Model</Text>
            </View>
          </View>
        </Animated.View>

        {/* Modern Quick Actions */}
        <Animated.View 
          style={[
            styles.section,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                style={[
                  styles.actionCard,
                  { 
                    transform: [{ scale: scaleAnim }],
                    opacity: fadeAnim
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleQuickAction(action.id)}
                >
                  <View style={styles.actionContent}>
                    <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                      <Ionicons name={action.icon as any} size={24} color={action.color} />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Modern AI Insights */}
        {insights && insights.length > 0 && (
          <Animated.View 
            style={[
              styles.section,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.insightsCard}>
              <View style={styles.insightsHeader}>
                <View style={styles.insightsIconContainer}>
                  <Ionicons name="bulb" size={20} color="#667eea" />
                </View>
                <Text style={styles.insightsTitle}>AI Insights</Text>
              </View>
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  </View>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Modern Digital Twin Status */}
        <Animated.View 
          style={[
            styles.section,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statusCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.statusGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusHeader}>
                  <View style={styles.statusIconContainer}>
                    <Ionicons name="person" size={24} color="#fff" />
                  </View>
                  <Text style={styles.statusTitle}>Digital Twin</Text>
                </View>
                <Text style={styles.statusText}>
                  {profile ? 'Your AI companion is ready to chat!' : 'Setting up your AI companion...'}
                </Text>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: profile ? '#4CAF50' : '#FF9800' }]} />
                  <Text style={styles.statusIndicatorText}>
                    {profile ? 'Active' : 'Initializing...'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Bottom spacing */}
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
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  profileButton: {
    marginLeft: 16,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statusCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerStatusCard: {
    width: (width - 60) / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerStatusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  headerStatusLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 3,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statTrendText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  actionButton: {
    padding: 20,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  insightsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    fontSize: 15,
    color: '#4a4a4a',
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  statusCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  statusGradient: {
    padding: 28,
  },
  statusContent: {
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusIndicatorText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
}); 