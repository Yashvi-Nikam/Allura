import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

export default function Signup() {
  const router = useRouter();
  const { colors, isDark } = useTheme(); // ✅ THEME
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [sent,     setSent]     = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
          emailRedirectTo: 'allura://auth/confirm',
        },
      });
      if (error) throw error;

      if (data.session) {
        // ✅ CORRECT: Go straight to Onboarding
        router.replace('/onboarding');
      } else {
        // Email confirmation required — show message
        setSent(true);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.sentWrap}>
          <Text style={[styles.sentOrnament, { color: colors.gold }]}>✦</Text>
          <Text style={[styles.sentTitle, { color: colors.text }]}>Check your email</Text>
          <Text style={[styles.sentBody, { color: colors.textSecondary }]}>
            We sent a confirmation link to{'\n'}
            <Text style={[styles.sentEmail, { color: colors.gold }]}>{email}</Text>
            {'\n\n'}
            Click the link in the email to activate your account, then come back and sign in.
          </Text>
          <TouchableOpacity
            style={[styles.sentBtn, { backgroundColor: colors.gold }]}
            onPress={() => router.replace('/auth' as any)}
          >
            <Text style={[styles.sentBtnText, { color: colors.background }]}>Go to sign in ✦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resendBtn}
            onPress={async () => {
              await supabase.auth.resend({ type: 'signup', email });
              setError('');
            }}
          >
            <Text style={[styles.resendText, { color: colors.textMuted }]}>Resend email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={[styles.backText, { color: colors.mauve }]}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <Text style={[styles.logo, { color: colors.gold }]}>Allura</Text>
            <Text style={[styles.tagline, { color: colors.gold }]}>Create your account ✦</Text>
          </View>

          {error ? (
            <View style={[styles.errorBox, { borderColor: colors.rose }]}>
              <Text style={[styles.errorText, { color: colors.rose }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.mauve }]}>Your name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="What should Allura call you?"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />

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
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="next"
            />

            <Text style={[styles.label, { color: colors.mauve }]}>Confirm password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Repeat your password"
              placeholderTextColor={colors.textMuted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.gold }, loading && styles.submitDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.submitText, { color: colors.background }]}>
                {loading ? 'Creating account...' : 'Create account ✦'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => router.back()}
          >
            <Text style={[styles.switchText, { color: colors.textMuted }]}>
              Already have an account?{' '}
              <Text style={[styles.switchTextAccent, { color: colors.gold }]}>Sign in</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 32 },
  sentWrap: {
    flex: 1, padding: 32,
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  sentOrnament: {
    fontSize: 40, marginBottom: 8,
  },
  sentTitle: {
    fontFamily: 'CormorantGaramond',
    fontSize: 36, textAlign: 'center',
  },
  sentBody: {
    fontFamily: 'Jost',
    fontSize: 14, textAlign: 'center', lineHeight: 22,
  },
  sentEmail: {
    fontFamily: 'Jost_Regular',
  },
  sentBtn: {
    paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: 2, marginTop: 8,
  },
  sentBtnText: {
    fontFamily: 'Raleway', fontSize: 11,
    letterSpacing: 3, textTransform: 'uppercase',
  },
  resendBtn: { padding: 12 },
  resendText: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  backBtn: { marginBottom: 24, alignSelf: 'flex-start' },
  backText: {
    fontFamily: 'Raleway', fontSize: 11,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logo: {
    fontFamily: 'DancingScript', fontSize: 46, marginBottom: 8,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 17,
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
  submitBtn: {
    padding: 18, alignItems: 'center', borderRadius: 2, marginTop: 24,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: {
    fontFamily: 'Raleway', fontSize: 11,
    letterSpacing: 3, textTransform: 'uppercase',
  },
  switchBtn: { alignItems: 'center', padding: 8 },
  switchText: { fontFamily: 'Jost', fontSize: 14 },
  switchTextAccent: { fontFamily: 'Jost_Regular' },
});