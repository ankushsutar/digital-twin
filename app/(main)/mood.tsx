import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDigitalTwinStore } from '../../store/digitalTwinStore';

export default function MoodScreen() {
  const { moodHistory, updateMood, getMoodTrend } = useDigitalTwinStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [context, setContext] = useState('');

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: '#4CAF50' },
    { emoji: '😔', label: 'Sad', value: 'sad', color: '#2196F3' },
    { emoji: '😡', label: 'Angry', value: 'angry', color: '#F44336' },
    { emoji: '😰', label: 'Anxious', value: 'anxious', color: '#FF9800' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: '#9C27B0' },
    { emoji: '🤗', label: 'Grateful', value: 'grateful', color: '#4CAF50' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: '#FF5722' },
    { emoji: '😌', label: 'Calm', value: 'calm', color: '#00BCD4' },
    { emoji: '🤔', label: 'Confused', value: 'confused', color: '#607D8B' },
    { emoji: '😎', label: 'Confident', value: 'confident', color: '#8BC34A' },
    { emoji: '😢', label: 'Crying', value: 'crying', color: '#2196F3' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: '#9E9E9E' },
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      Alert.alert('Select Mood', 'Please select how you\'re feeling.');
      return;
    }

    updateMood(selectedMood, intensity, context);
    
    Alert.alert('Mood Logged', 'Your mood has been recorded successfully!');
    
    // Reset form
    setSelectedMood(null);
    setIntensity(5);
    setContext('');
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

  const getMoodEmoji = (mood: string) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption?.emoji || '😐';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return '#ff6b6b';
    if (intensity <= 7) return '#ffa726';
    return '#66bb6a';
  };

  const renderMoodGrid = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>How are you feeling?</Text>
      <View style={styles.moodGrid}>
        {moodOptions.map(mood => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodOption,
              selectedMood === mood.value && styles.moodOptionSelected,
              selectedMood === mood.value && { borderColor: mood.color }
            ]}
            onPress={() => handleMoodSelect(mood.value)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[
              styles.moodLabel,
              selectedMood === mood.value && styles.moodLabelSelected
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderIntensitySlider = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Intensity Level</Text>
      <Text style={styles.sectionSubtitle}>
        How strongly are you feeling this emotion?
      </Text>
      <View style={styles.intensityContainer}>
        <Text style={styles.intensityLabel}>Low</Text>
        <View style={styles.intensitySlider}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.intensityDot,
                intensity >= value && { backgroundColor: getIntensityColor(intensity) }
              ]}
              onPress={() => handleIntensityChange(value)}
            />
          ))}
        </View>
        <Text style={styles.intensityLabel}>High</Text>
      </View>
      <Text style={styles.intensityValue}>Level {intensity}</Text>
    </View>
  );

  const renderContextInput = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>What's on your mind?</Text>
      <Text style={styles.sectionSubtitle}>
        Optional: Add context about your mood
      </Text>
      <TextInput
        style={styles.contextInput}
        value={context}
        onChangeText={setContext}
        placeholder="e.g., Had a great meeting, feeling stressed about work..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={3}
        maxLength={200}
      />
    </View>
  );

  const renderMoodOverview = () => {
    const { trend, recentMoods, totalEntries } = getMoodTrendData();
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Overview</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalEntries}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{trend.average.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Intensity</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'}
            </Text>
            <Text style={styles.statLabel}>Trend</Text>
          </View>
        </View>

        {recentMoods.length > 0 && (
          <View style={styles.recentMoodsContainer}>
            <Text style={styles.subsectionTitle}>Recent Moods</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentMoods.map((mood, index) => (
                <View key={index} style={styles.recentMoodItem}>
                  <Text style={styles.recentMoodEmoji}>
                    {getMoodEmoji(mood.mood)}
                  </Text>
                  <Text style={styles.recentMoodIntensity}>
                    {mood.intensity}
                  </Text>
                  <Text style={styles.recentMoodTime}>
                    {mood.timestamp.toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Track Your Mood</Text>
        <Text style={styles.headerSubtitle}>
          Log your emotions and track patterns over time
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderMoodGrid()}
        {renderIntensitySlider()}
        {renderContextInput()}
        {renderMoodOverview()}

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !selectedMood && styles.saveButtonDisabled
            ]}
            onPress={handleSaveMood}
            disabled={!selectedMood}
          >
            <Text style={styles.saveButtonText}>
              Log Mood
            </Text>
          </TouchableOpacity>
        </View>

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
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
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
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moodOptionSelected: {
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  moodLabelSelected: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#666',
    width: 30,
  },
  intensitySlider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  intensityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  contextInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  recentMoodsContainer: {
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  recentMoodItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
  },
  recentMoodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  recentMoodIntensity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  recentMoodTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  saveSection: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#e0e0e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
}); 