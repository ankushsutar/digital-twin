import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
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
import { DigitalTwinProfile } from '../../types/user';

export default function PersonalityScreen() {
  const { profile, updateProfile, initializeProfile } = useDigitalTwinStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [personality, setPersonality] = useState({
    traits: profile?.personality.traits || ['curious', 'empathetic', 'analytical'],
    communicationStyle: profile?.personality.communicationStyle || 'friendly',
    interests: profile?.personality.interests || ['technology', 'personal growth', 'creativity'],
    goals: profile?.personality.goals || ['help users achieve their goals', 'provide meaningful insights'],
  });

  const [settings, setSettings] = useState({
    responseLength: profile?.settings.responseLength || 'medium',
    formality: profile?.settings.formality || 'casual',
    topics: profile?.settings.topics || ['general', 'personal', 'professional'],
  });

  const personalityTraits = [
    'curious', 'empathetic', 'analytical', 'creative', 'logical', 'intuitive',
    'supportive', 'motivational', 'humorous', 'serious', 'adventurous', 'cautious',
    'optimistic', 'realistic', 'detail-oriented', 'big-picture', 'patient', 'energetic'
  ];

  const communicationStyles = [
    { value: 'friendly', label: 'Friendly & Warm' },
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'casual', label: 'Casual & Relaxed' },
    { value: 'direct', label: 'Direct & Straightforward' },
    { value: 'encouraging', label: 'Encouraging & Motivational' },
  ];

  const responseLengths = [
    { value: 'short', label: 'Short & Concise' },
    { value: 'medium', label: 'Medium Length' },
    { value: 'long', label: 'Detailed & Comprehensive' },
  ];

  const formalityLevels = [
    { value: 'casual', label: 'Casual' },
    { value: 'semi-formal', label: 'Semi-Formal' },
    { value: 'formal', label: 'Formal' },
  ];

  const topicAreas = [
    'general', 'personal', 'professional', 'health', 'relationships',
    'career', 'education', 'creativity', 'technology', 'spirituality',
    'fitness', 'finance', 'travel', 'food', 'entertainment'
  ];

  const toggleTrait = (trait: string) => {
    setPersonality(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait].slice(0, 5), // Max 5 traits
    }));
  };

  const toggleInterest = (interest: string) => {
    setPersonality(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest].slice(0, 5), // Max 5 interests
    }));
  };

  const addGoal = (goal: string) => {
    if (goal.trim() && !personality.goals.includes(goal.trim())) {
      setPersonality(prev => ({
        ...prev,
        goals: [...prev.goals, goal.trim()].slice(0, 3), // Max 3 goals
      }));
    }
  };

  const removeGoal = (goal: string) => {
    setPersonality(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal),
    }));
  };

  const toggleTopic = (topic: string) => {
    setSettings(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic].slice(0, 5), // Max 5 topics
    }));
  };

  const handleSave = async () => {
    if (personality.traits.length === 0) {
      Alert.alert('Error', 'Please select at least one personality trait.');
      return;
    }

    setIsLoading(true);
    try {
      const updates: Partial<DigitalTwinProfile> = {
        personality,
        settings,
      };

      await updateProfile(updates);
      Alert.alert('Success', 'Your Digital Twin personality has been updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update personality. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelectionList = (
    title: string,
    items: string[],
    selectedItems: string[],
    onToggle: (item: string) => void,
    maxItems?: number
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {maxItems && (
        <Text style={styles.sectionSubtitle}>
          Select up to {maxItems} items
        </Text>
      )}
      <View style={styles.selectionGrid}>
        {items.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.selectionItem,
              selectedItems.includes(item) && styles.selectionItemSelected
            ]}
            onPress={() => onToggle(item)}
          >
            <Text style={[
              styles.selectionText,
              selectedItems.includes(item) && styles.selectionTextSelected
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOptionList = (
    title: string,
    options: { value: string; label: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionList}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              selectedValue === option.value && styles.optionItemSelected
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              selectedValue === option.value && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
            {selectedValue === option.value && (
              <Ionicons name="checkmark" size={20} color="#667eea" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const addGoalInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customize Your Digital Twin</Text>
        <Text style={styles.headerSubtitle}>
          Personalize your AI companion's personality and behavior
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Personality Traits */}
        {renderSelectionList(
          'Personality Traits',
          personalityTraits,
          personality.traits,
          toggleTrait,
          5
        )}

        {/* Communication Style */}
        {renderOptionList(
          'Communication Style',
          communicationStyles,
          personality.communicationStyle,
          (value) => setPersonality(prev => ({ ...prev, communicationStyle: value }))
        )}

        {/* Interests */}
        {renderSelectionList(
          'Areas of Interest',
          topicAreas,
          personality.interests,
          toggleInterest,
          5
        )}

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals & Objectives</Text>
          <Text style={styles.sectionSubtitle}>
            What should your Digital Twin help you with?
          </Text>
          <View style={styles.goalsList}>
            {personality.goals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <Text style={styles.goalText}>{goal}</Text>
                <TouchableOpacity
                  onPress={() => removeGoal(goal)}
                  style={styles.removeGoalButton}
                >
                  <Ionicons name="close" size={16} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {personality.goals.length < 3 && (
            <View style={styles.addGoalContainer}>
              <TextInput
                ref={addGoalInputRef}
                style={styles.addGoalInput}
                placeholder="Add a new goal..."
                placeholderTextColor="#999"
                onSubmitEditing={(e) => {
                  addGoal(e.nativeEvent.text);
                  addGoalInputRef.current?.clear();
                }}
              />
            </View>
          )}
        </View>

        {/* Response Settings */}
        {renderOptionList(
          'Response Length',
          responseLengths,
          settings.responseLength,
          (value) => setSettings(prev => ({ ...prev, responseLength: value as any }))
        )}

        {renderOptionList(
          'Formality Level',
          formalityLevels,
          settings.formality,
          (value) => setSettings(prev => ({ ...prev, formality: value as any }))
        )}

        {/* Preferred Topics */}
        {renderSelectionList(
          'Preferred Topics',
          topicAreas,
          settings.topics,
          toggleTopic,
          5
        )}

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Personality'}
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 10, // changed from 60 to 10
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
  section: {
    margin: 20,
    marginBottom: 10,
    marginTop: 10, // ensure upper margin is 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectionItemSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  selectionText: {
    fontSize: 14,
    color: '#333',
  },
  selectionTextSelected: {
    color: '#fff',
  },
  optionList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionItemSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  goalsList: {
    gap: 8,
    marginTop: 10, // add upper margin
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  goalText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  removeGoalButton: {
    padding: 4,
  },
  addGoalContainer: {
    marginTop: 12,
    paddingTop: 10, // add upper padding
  },
  addGoalInput: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#333',
  },
  saveSection: {
    margin: 20,
    marginTop: 10, // changed from 40 to 10
  },
  saveButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 