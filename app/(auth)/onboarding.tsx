import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

const dummyAccounts = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    description: 'Software Developer',
    avatar: '👨‍💻',
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    description: 'Designer',
    avatar: '👩‍🎨',
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    description: 'Student',
    avatar: '👨‍🎓',
  },
];

export default function OnboardingScreen() {
  const { login } = useAuthStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
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

  const handleDummyLogin = async (account: typeof dummyAccounts[0]) => {
    try {
      await login({ email: account.email, password: account.password });
      router.replace('/(main)/home');
    } catch (error) {
      console.error('Dummy login failed:', error);
    }
  };

  const handleCustomLogin = () => {
    router.push('/(auth)/login');
  };

  const handleCustomRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#fff', '#f8f9fa']}
                style={styles.logoBackground}
              >
                <Ionicons name="person-circle" size={80} color="#667eea" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Digital Twin</Text>
            <Text style={styles.subtitle}>Your AI Companion</Text>
          </Animated.View>

          {/* Welcome Message */}
          <Animated.View 
            style={[
              styles.welcomeCard,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Welcome! 👋</Text>
                <Text style={styles.welcomeText}>
                  Experience your personalized AI companion. Choose a demo account to get started quickly, or create your own account.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Demo Accounts */}
          <Animated.View 
            style={[
              styles.section,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Try Demo Accounts</Text>
            <Text style={styles.sectionSubtitle}>Quick start with pre-configured profiles</Text>
            
            {dummyAccounts.map((account, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.accountCard,
                  { 
                    transform: [{ scale: scaleAnim }],
                    opacity: fadeAnim
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.accountButton}
                  onPress={() => handleDummyLogin(account)}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                    style={styles.accountGradient}
                  >
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountAvatar}>{account.avatar}</Text>
                      <View style={styles.accountDetails}>
                        <Text style={styles.accountName}>{account.name}</Text>
                        <Text style={styles.accountEmail}>{account.email}</Text>
                        <Text style={styles.accountDescription}>{account.description}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#667eea" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Custom Account Options */}
          <Animated.View 
            style={[
              styles.section,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Create Your Own</Text>
            <Text style={styles.sectionSubtitle}>Set up your personalized experience</Text>
            
            <TouchableOpacity 
              style={styles.customButton} 
              onPress={handleCustomLogin}
            >
              <LinearGradient
                colors={['#fff', '#f8f9fa']}
                style={styles.customButtonGradient}
              >
                <Ionicons name="log-in" size={24} color="#667eea" />
                <Text style={styles.customButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.customButtonOutline} 
              onPress={handleCustomRegister}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.customButtonOutlineGradient}
              >
                <Ionicons name="person-add" size={24} color="#fff" />
                <Text style={styles.customButtonOutlineText}>Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeCard: {
    marginBottom: 40,
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
  welcomeGradient: {
    padding: 24,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  accountCard: {
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
  accountButton: {
    height: 80,
  },
  accountGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  accountInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  accountDescription: {
    fontSize: 12,
    color: '#999',
  },
  customButton: {
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
  customButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  customButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 12,
  },
  customButtonOutline: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  customButtonOutlineGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  customButtonOutlineText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
}); 