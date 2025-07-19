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
      
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Animated.View style={[styles.greetingContainer, { opacity: fadeAnim }]}>
              <Text style={styles.greeting}>Hello, {getUserGreeting()}! 👋</Text>
              <Text style={styles.subtitle}>How are you feeling today?</Text>
            </Animated.View>
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
                <Ionicons name="person" size={24} color="#667eea" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mood Card */}
        <Animated.View 
          style={[
            styles.moodCard,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={getMoodColor()}
            style={styles.moodGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.moodContent}>
              <View style={styles.moodHeader}>
                <Ionicons name="heart" size={28} color="#fff" />
                <Text style={styles.moodTitle}>Your Mood</Text>
              </View>
              <View style={styles.moodDisplay}>
                <Animated.Text 
                  style={[
                    styles.moodEmoji,
                    { transform: [{ scale: scaleAnim }] }
                  ]}
                >
                  {getMoodEmoji()}
                </Animated.Text>
                <Text style={styles.moodDescription}>
                  {getMoodDescription()}
                </Text>
                <View style={styles.moodStats}>
                  <Text style={styles.moodStatText}>
                    Average: {getMoodAverage()}/10
                  </Text>
                  <Text style={styles.moodTrendText}>
                    {getMoodTrendText()}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions Grid */}
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
          <View style={styles.actionsGrid}>
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
                  <LinearGradient
                    colors={action.gradient}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={action.icon as any} size={28} color="#fff" />
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* AI Insights */}
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
                <Ionicons name="bulb" size={24} color="#667eea" />
                <Text style={styles.insightsTitle}>AI Insights</Text>
              </View>
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  </View>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Digital Twin Status */}
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
                  <Ionicons name="person" size={28} color="#fff" />
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
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  profileButton: {
    marginLeft: 16,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  moodCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  moodGradient: {
    padding: 24,
  },
  moodContent: {
    alignItems: 'center',
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  moodDisplay: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  moodDescription: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  moodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  moodStatText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  moodTrendText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButton: {
    height: 120,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    marginRight: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  statusCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  statusGradient: {
    padding: 24,
  },
  statusContent: {
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
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