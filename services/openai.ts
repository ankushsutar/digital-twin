import { env } from '../config/env';
import { apiClient } from '../lib/api';
import { OpenAIMessage, OpenAIRequest, OpenAIResponse } from '../types/api';
import { DigitalTwinProfile } from '../types/user';

export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string;
  private isConfigured: boolean;

  private constructor() {
    this.apiKey = env.OPENAI_API_KEY;
    this.isConfigured = !!this.apiKey && this.apiKey.length > 0;
    
    if (!this.isConfigured) {
      console.warn('OpenAI API key not configured. Using mock responses for development.');
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateResponse(
    messages: OpenAIMessage[],
    profile?: DigitalTwinProfile,
    options?: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    }
  ): Promise<string> {
    if (!this.isConfigured) {
      return this.generateMockResponse(messages, profile);
    }

    try {
      // Build system message based on digital twin profile
      const systemMessage = this.buildSystemMessage(profile);
      
      const request: OpenAIRequest = {
        model: options?.model || 'gpt-4',
        messages: [systemMessage, ...messages],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1000,
      };

      const response = await apiClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        request,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to mock response if API fails
      return this.generateMockResponse(messages, profile);
    }
  }

  async analyzeMood(text: string): Promise<{ mood: string; intensity: number }> {
    if (!this.isConfigured) {
      return this.analyzeMoodMock(text);
    }

    const prompt = `Analyze the emotional tone of this text and respond with a JSON object containing:
    - mood: a single word describing the primary emotion (e.g., "happy", "sad", "anxious", "excited")
    - intensity: a number from 1-10 indicating the intensity of the emotion
    
    Text: "${text}"
    
    Respond only with valid JSON.`;

    try {
      const response = await this.generateResponse(
        [{ role: 'user', content: prompt }],
        undefined,
        { temperature: 0.3, maxTokens: 100 }
      );

      const result = JSON.parse(response);
      return {
        mood: result.mood || 'neutral',
        intensity: Math.max(1, Math.min(10, result.intensity || 5)),
      };
    } catch (error) {
      console.error('Mood analysis error:', error);
      return this.analyzeMoodMock(text);
    }
  }

  async generatePersonalityInsights(profile: DigitalTwinProfile): Promise<string[]> {
    if (!this.isConfigured) {
      return this.generateMockInsights(profile);
    }

    const prompt = `Based on this digital twin profile, provide 3-5 insights about the user's personality and behavior patterns:

    Personality: ${profile.personality.traits.join(', ')}
    Communication Style: ${profile.personality.communicationStyle}
    Interests: ${profile.personality.interests.join(', ')}
    Goals: ${profile.personality.goals.join(', ')}
    Recent Conversations: ${profile.memory.conversations.slice(-10).join(' | ')}
    Mood History: ${profile.memory.moodHistory.slice(-5).map(m => `${m.mood}(${m.intensity})`).join(', ')}

    Provide insights as a JSON array of strings.`;

    try {
      const response = await this.generateResponse(
        [{ role: 'user', content: prompt }],
        undefined,
        { temperature: 0.5, maxTokens: 300 }
      );

      const insights = JSON.parse(response);
      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      console.error('Personality insights error:', error);
      return this.generateMockInsights(profile);
    }
  }

  private buildSystemMessage(profile?: DigitalTwinProfile): OpenAIMessage {
    if (!profile) {
      return {
        role: 'system',
        content: 'You are a helpful AI assistant. Be friendly, empathetic, and provide thoughtful responses.',
      };
    }

    const { personality, settings } = profile;
    
    return {
      role: 'system',
      content: `You are a digital twin AI assistant with the following characteristics:

Personality Traits: ${personality.traits.join(', ')}
Communication Style: ${personality.communicationStyle}
Interests: ${personality.interests.join(', ')}
Goals: ${personality.goals.join(', ')}

Response Settings:
- Length: ${settings.responseLength}
- Formality: ${settings.formality}
- Preferred Topics: ${settings.topics.join(', ')}

Remember previous conversations and adapt your responses based on the user's communication patterns and preferences. Be consistent with your personality while remaining helpful and engaging.`,
    };
  }

  // Mock response generator for development
  private generateMockResponse(messages: OpenAIMessage[], profile?: DigitalTwinProfile): string {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content.toLowerCase() || '';
    
    const mockResponses = [
      "I understand how you're feeling. Let's explore this together.",
      "That's an interesting perspective! I'd love to hear more about your thoughts on this.",
      "I'm here to support you. What would be most helpful right now?",
      "Thank you for sharing that with me. It sounds like this is important to you.",
      "I appreciate you opening up about this. How can I best assist you today?",
      "That's a great question! Let me think about this with you.",
      "I can see why you'd feel that way. What's your next step?",
      "You're making good progress. What would you like to focus on next?",
    ];

    // Simple keyword-based responses
    if (userMessage.includes('hello') || userMessage.includes('hi')) {
      return "Hello! I'm your Digital Twin. How are you feeling today?";
    }
    if (userMessage.includes('how are you')) {
      return "I'm doing well, thank you for asking! I'm here to support you. What's on your mind?";
    }
    if (userMessage.includes('help')) {
      return "I'm here to help! I can chat with you, track your mood, provide insights, and adapt to your personality. What would you like to explore?";
    }
    if (userMessage.includes('mood') || userMessage.includes('feeling')) {
      return "I'd love to hear about your mood! You can track your emotions in the Mood tab, and I'll help you understand your patterns over time.";
    }
    if (userMessage.includes('personality')) {
      return "I'm designed to adapt to your personality! You can customize my traits, communication style, and preferences in the Personality tab.";
    }

    // Return random mock response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  // Mock mood analysis for development
  private analyzeMoodMock(text: string): { mood: string; intensity: number } {
    const textLower = text.toLowerCase();
    
    // Simple keyword-based mood detection
    if (textLower.includes('happy') || textLower.includes('great') || textLower.includes('excited')) {
      return { mood: 'happy', intensity: 8 };
    }
    if (textLower.includes('sad') || textLower.includes('depressed') || textLower.includes('down')) {
      return { mood: 'sad', intensity: 7 };
    }
    if (textLower.includes('angry') || textLower.includes('frustrated') || textLower.includes('mad')) {
      return { mood: 'angry', intensity: 6 };
    }
    if (textLower.includes('anxious') || textLower.includes('worried') || textLower.includes('nervous')) {
      return { mood: 'anxious', intensity: 5 };
    }
    if (textLower.includes('tired') || textLower.includes('exhausted') || textLower.includes('sleepy')) {
      return { mood: 'tired', intensity: 6 };
    }
    
    return { mood: 'neutral', intensity: 5 };
  }

  // Mock insights generator for development
  private generateMockInsights(profile: DigitalTwinProfile): string[] {
    const insights = [
      "You tend to be reflective and thoughtful in your conversations.",
      "Your communication style shows a preference for meaningful dialogue.",
      "You're consistent in expressing your thoughts and feelings.",
      "Your mood patterns suggest you're generally optimistic.",
      "You engage deeply with topics that interest you.",
    ];

    // Customize based on personality traits
    if (profile.personality.traits.includes('analytical')) {
      insights.push("You approach problems with logical thinking and careful analysis.");
    }
    if (profile.personality.traits.includes('empathetic')) {
      insights.push("You show strong emotional intelligence in your interactions.");
    }
    if (profile.personality.traits.includes('creative')) {
      insights.push("You often think outside the box and offer unique perspectives.");
    }

    return insights.slice(0, 5); // Return up to 5 insights
  }

  // Legacy function for backward compatibility
  async askGPT(prompt: string): Promise<string> {
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  // Check if the service is properly configured
  isApiConfigured(): boolean {
    return this.isConfigured;
  }
}

// Export singleton instance
export const openAIService = OpenAIService.getInstance();