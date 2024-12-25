import React from 'react';
import { Text, View, StyleSheet, Animated, Easing } from 'react-native';

interface ErrorMessageProps {
  error: string;
  slideAnim: Animated.Value;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, slideAnim }) => {
  Animated.timing(slideAnim, {
    toValue: error ? 0 : 100,
    duration: 500,
    easing: Easing.cubic,
    useNativeDriver: true,
  }).start();

  return (
    <Animated.View
      style={[
        styles.errorContainer,
        { transform: [{ translateY: slideAnim }] }, // Apply the slide-in/out animation
      ]}
    >
      <Text style={styles.errorText}>{error}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    top: 64,
    backgroundColor: '#D83919',
    width: '80%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    zIndex: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'white',
  },
});

export default ErrorMessage;