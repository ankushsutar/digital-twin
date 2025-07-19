import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  type?: 'spinner' | 'dots' | 'pulse';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  fullScreen = false,
  type = 'spinner',
}) => {
  const [dotAnimation] = React.useState(new Animated.Value(0));
  const [pulseAnimation] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    if (type === 'dots') {
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => animateDots());
      };
      animateDots();
    } else if (type === 'pulse') {
      const animatePulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => animatePulse());
      };
      animatePulse();
    }
  }, [type, dotAnimation, pulseAnimation]);

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity: dotAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scale: dotAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        );
      case 'pulse':
        return (
          <Animated.View
            style={[
              styles.pulseContainer,
              {
                transform: [{ scale: pulseAnimation }],
              },
            ]}
          >
            <View style={[styles.pulseCircle, { backgroundColor: color }]} />
          </Animated.View>
        );
      default:
        return (
          <ActivityIndicator
            size={size}
            color={color}
            style={styles.spinner}
          />
        );
    }
  };

  const content = (
    <View style={styles.container}>
      {renderSpinner()}
      {text && (
        <ThemedText style={styles.text}>{text}</ThemedText>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <ThemedView style={styles.fullScreen}>
        {content}
      </ThemedView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
  },
  pulseContainer: {
    marginBottom: 16,
  },
  pulseCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
}); 