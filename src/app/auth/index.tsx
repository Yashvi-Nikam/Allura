import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import * as WebBrowser from 'expo-web-browser';

export default function Login() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
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

  // 🚨 GOOGLE LOGIN FUNCTION
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'allura://auth-callback',
        skipBrowserRedirect: true,
      },
    });

    if (data?.url) {
      await WebBrowser.openAuthSessionAsync(data.url, 'allura://auth-callback');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            <Text style={[styles.logo, { color: colors.gold }]}>Allura</Text>
            <Text style={[styles.tagline, { color: colors.gold }]}>Welcome back ✦</Text>
          </View>

          {error ? (
            <View style={[styles.errorBox, { borderColor: colors.rose }]}>
              <Text style={[styles.errorText, { color: colors.rose }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.mauve }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="your@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <Text style={[styles.label, { color: colors.mauve }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
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
              <Text style={[styles.forgotText, { color: colors.mauve }]}>Forgot password?</Text>
            </TouchableOpacity>

            {/* EMAIL/PASSWORD LOGIN */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.gold }, loading && styles.submitDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.submitText, { color: colors.background }]}>
                {loading ? 'Signing in...' : 'Sign in ✦'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* GOOGLE LOGIN BUTTON */}
          <TouchableOpacity
            style={[styles.googleBtn, { borderColor: colors.borderFocus }]}
            onPress={handleGoogleLogin}
          >
            <Text style={[styles.googleBtnText, { color: colors.gold }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => router.push('/auth/signup' as any)}
          >
            <Text style={[styles.switchText, { color: colors.textMuted }]}>
              Don't have an account?{' '}
              <Text style={[styles.switchTextAccent, { color: colors.gold }]}>Sign up</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 32, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 48 },
  logo: {
    fontFamily: 'DancingScript', fontSize: 52, marginBottom: 8,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 18,
  },
  errorBox: {
    backgroundColor: 'rgba(240,153,123,0.1)',
    borderWidth: 0.5, borderRadius: 8, padding: 12, marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Jost', fontSize: 13, textAlign: 'center',
  },
  form: { marginBottom: 24 },
  label: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, marginTop: 16,
  },
  input: {
    borderWidth: 0.5, borderRadius: 8, padding: 16,
    fontFamily: 'Jost_Regular', fontSize: 15,
  },
  forgotBtn: {
    alignSelf: 'flex-end', marginTop: 10, marginBottom: 24,
  },
  forgotText: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  submitBtn: {
    padding: 18, alignItems: 'center', borderRadius: 2,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: {
    fontFamily: 'Raleway', fontSize: 11,
    letterSpacing: 3, textTransform: 'uppercase',
  },
  googleBtn: {
    borderWidth: 0.5, padding: 18, alignItems: 'center',
    borderRadius: 2, marginBottom: 16,
  },
  googleBtnText: {
    fontFamily: 'Raleway', fontSize: 11,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  switchBtn: { alignItems: 'center', padding: 8 },
  switchText: { fontFamily: 'Jost', fontSize: 14 },
  switchTextAccent: { fontFamily: 'Jost_Regular' },
});