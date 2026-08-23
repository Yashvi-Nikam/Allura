import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function LoadingState({ message = "Allura is thinking..." }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.ornament, { opacity: pulse }]}>✦</Animated.Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13111A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  ornament: {
    fontSize: 32,
    color: '#C9AB85',
  },
  message: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 16,
    color: 'rgba(201,171,133,0.7)',
    letterSpacing: 1,
  },
});