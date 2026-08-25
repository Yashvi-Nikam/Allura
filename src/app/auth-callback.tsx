import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Parse the URL to see if we have a code
      const url = window.location.href; // Or the deep link URL from the app
      
      // Check if it has a code (this is how Google sends it)
      const code = new URLSearchParams(url.split('?')[1]).get('code');
      
      if (code) {
        // 2. EXCHANGE THE CODE FOR A SESSION!
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error && data.session) {
          router.replace('/onboarding');
        } else {
          router.replace('/auth');
        }
      } else {
        // If no code, just check if they're already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            router.replace('/onboarding');
          } else {
            router.replace('/auth');
          }
        });
      }
    };

    handleCallback();
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