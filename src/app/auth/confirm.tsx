import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Confirm() {
  const router = useRouter();

  useEffect(() => {
    // Listen for when the session appears (it takes a tiny delay)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is now confirmed and logged in
        router.replace('/onboarding');
      }
    });

    // Also check immediately in case session is already there
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/onboarding');
      }
    });

    // Cleanup the listener when component unmounts
    return () => authListener.subscription.unsubscribe();
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