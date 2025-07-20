# Digital Twin Me - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI Configuration (Required for full functionality)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (Optional for now)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
APP_ENV=development
API_BASE_URL=https://api.yourdomain.com
```

### 3. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the sidebar
4. Click "Create new secret key"
5. Copy the key and paste it in your `.env` file

### 4. Run the App

```bash
# Start the development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## 🔧 Configuration Options

### Demo Mode (No API Key Required)
If you don't have an OpenAI API key, the app will run in demo mode with:
- Mock AI responses
- Simulated mood analysis
- Generated personality insights
- All core functionality works for demonstration

### Full Mode (With API Key)
With a valid OpenAI API key, you get:
- Real AI conversations using GPT-4
- Accurate mood analysis from chat messages
- AI-generated personality insights
- Context-aware responses based on your personality

## 📱 App Features

### Core Functionality
- **Chat**: Talk to your personalized AI companion
- **Mood Tracking**: Log and analyze your emotions
- **Personality**: Customize your AI's traits and behavior
- **Insights**: View analytics and behavioral patterns
- **Sessions**: Manage your conversation history

### Navigation
- **Home**: Overview and quick actions
- **Chat**: AI conversations
- **Mood**: Emotion tracking
- **Insights**: Analytics and patterns
- **Personality**: AI customization
- **Profile**: Settings and account

## 🛠️ Development

### Project Structure
```
app/
├── (auth)/          # Authentication screens
├── (main)/          # Main app screens
└── _layout.tsx      # Root layout

components/          # Reusable UI components
services/           # API services (OpenAI, Supabase)
store/              # State management (Zustand)
types/              # TypeScript type definitions
```

### Key Technologies
- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **Expo Router** for navigation
- **OpenAI API** for AI functionality

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- API keys are stored securely in Expo's environment system
- Mock responses are used when API keys are not configured

## 🐛 Troubleshooting

### "OpenAI API key not configured" Error
- Check that your `.env` file exists in the root directory
- Verify the API key is correctly copied from OpenAI
- Restart the development server after adding the `.env` file
- The app will work in demo mode without an API key

### App Not Starting
- Make sure all dependencies are installed: `npm install`
- Clear Metro cache: `npx expo start --clear`
- Check for TypeScript errors: `npx tsc --noEmit`

### Navigation Issues
- Ensure Expo Router is properly configured
- Check that all screen files exist in the correct directories
- Verify the navigation structure in `app/(main)/_layout.tsx`

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests! 