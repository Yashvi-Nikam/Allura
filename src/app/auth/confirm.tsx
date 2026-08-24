import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Confirm() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is now confirmed
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User confirmed and logged in — go to onboarding
        router.replace('/onboarding');
      } else {
        // Something went wrong — back to login
        router.replace('/auth' as any);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.ornament}>✦</Text>
      <Text style={styles.text}>Confirming your account...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#13111A',
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  ornament: { fontSize: 32, color: '#C9AB85' },
  text: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 16, color: 'rgba(201,171,133,0.7)',
  },
});