import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // If already logged in — skip to home
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/home');
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace('/home');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <Text style={styles.logo}>Allura</Text>
            <Text style={styles.tagline}>Welcome back ✦</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#5A5650"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#5A5650"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/auth/forgot' as any)}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>
                {loading ? 'Signing in...' : 'Sign in ✦'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => router.push('/auth/signup' as any)}
          >
            <Text style={styles.switchText}>
              Don't have an account?{' '}
              <Text style={styles.switchTextAccent}>Sign up</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { flexGrow: 1, padding: 32, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 48 },
  logo: {
    fontFamily: 'DancingScript', fontSize: 52,
    color: '#C9AB85', marginBottom: 8,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 18, color: 'rgba(201,171,133,0.7)',
  },
  errorBox: {
    backgroundColor: 'rgba(240,153,123,0.1)',
    borderWidth: 0.5, borderColor: 'rgba(240,153,123,0.3)',
    borderRadius: 8, padding: 12, marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Jost', fontSize: 13,
    color: '#F0997B', textAlign: 'center',
  },
  form: { marginBottom: 32 },
  label: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 2, textTransform: 'uppercase',
    color: '#9B7FA6', marginBottom: 8, marginTop: 16,
  },
  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8, padding: 16,
    fontFamily: 'Jost_Regular', fontSize: 15, color: '#F0ECE4',
  },
  forgotBtn: {
    alignSelf: 'flex-end', marginTop: 10, marginBottom: 24,
  },
  forgotText: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 1, color: '#9B7FA6', textTransform: 'uppercase',
  },
  submitBtn: {
    backgroundColor: '#C9AB85', padding: 18,
    alignItems: 'center', borderRadius: 2,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: {
    fontFamily: 'Raleway', fontSize: 11,
    letterSpacing: 3, textTransform: 'uppercase', color: '#13111A',
  },
  switchBtn: { alignItems: 'center', padding: 8 },
  switchText: { fontFamily: 'Jost', fontSize: 14, color: '#5A5650' },
  switchTextAccent: { color: '#C9AB85', fontFamily: 'Jost_Regular' },
});