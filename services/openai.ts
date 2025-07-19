import { env } from '../config/env';
import { apiClient } from '../lib/api';
import { OpenAIMessage, OpenAIRequest, OpenAIResponse } from '../types/api';
import { DigitalTwinProfile } from '../types/user';

export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string;

  private constructor() {
    this.apiKey = env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
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
      throw new Error('Failed to generate response from AI');
    }
  }

  async analyzeMood(text: string): Promise<{ mood: string; intensity: number }> {
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
      return { mood: 'neutral', intensity: 5 };
    }
  }

  async generatePersonalityInsights(profile: DigitalTwinProfile): Promise<string[]> {
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
      return [];
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

  // Legacy function for backward compatibility
  async askGPT(prompt: string): Promise<string> {
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }
}

// Export singleton instance
export const openAIService = OpenAIService.getInstance();