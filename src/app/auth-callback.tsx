import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Go straight to Onboarding!
        router.replace('/onboarding');
      } else {
        // If something went wrong, go to login
        router.replace('/auth');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.ornament}>✦</Text>
      <Text style={styles.text}>Signing you in...</Text>
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