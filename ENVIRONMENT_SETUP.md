# Environment Setup Guide

This guide will help you set up the environment variables needed for the Digital Twin application.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration
APP_ENV=development
API_BASE_URL=https://api.yourdomain.com
```

## Getting Your API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the sidebar
4. Click "Create new secret key"
5. Copy the generated key and add it to your `.env` file

### Supabase Configuration
1. Go to [Supabase](https://supabase.com/)
2. Create a new project or use an existing one
3. Go to Settings > API
4. Copy the "Project URL" and "anon public" key
5. Add them to your `.env` file

## Environment Configuration

The app uses Expo's environment variable system. The configuration is handled in `config/env.ts` which:

- Reads environment variables from Expo Constants
- Validates required variables on app startup
- Provides helper functions for environment checks

## Security Best Practices

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. **Use different keys for development and production**
3. **Rotate your API keys regularly**
4. **Use environment-specific configurations**

## Development vs Production

### Development
- Use test API keys
- Enable debug logging
- Use local development URLs

### Production
- Use production API keys
- Disable debug logging
- Use production URLs
- Enable error reporting (Sentry, etc.)

## Troubleshooting

### "Missing required environment variable" Error
1. Check that your `.env` file exists in the root directory
2. Verify all required variables are set
3. Restart your development server
4. Clear Metro cache: `npx expo start --clear`

### API Key Not Working
1. Verify the API key is correct
2. Check your API usage limits
3. Ensure the key has the necessary permissions
4. Test the key in the respective platform's dashboard

### Supabase Connection Issues
1. Verify your project URL and anon key
2. Check your Supabase project status
3. Ensure your database is running
4. Check your Row Level Security (RLS) policies

## Next Steps

After setting up your environment variables:

1. Run `npm install` to ensure all dependencies are installed
2. Start the development server: `npx expo start`
3. Test the app on your device or simulator
4. Check the console for any configuration errors

## Additional Configuration

### For Production Deployment
- Set up proper environment variables in your hosting platform
- Configure build-time environment injection
- Set up monitoring and error reporting
- Configure SSL certificates

### For Team Development
- Create a `.env.example` file with placeholder values
- Document any additional setup steps
- Set up shared development databases
- Configure CI/CD environment variables 