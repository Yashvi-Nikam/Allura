import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const router  = useRouter();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleReset = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'allura://auth/reset',
      });
      if (error) throw error;
      setSent(true);
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
        <View style={styles.inner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.sub}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          {sent ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                ✦ Check your email for a reset link.
              </Text>
              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => router.replace('/auth' as any)}
              >
                <Text style={styles.backToLoginText}>Back to sign in</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#5A5650"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={handleReset}
              />

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitDisabled]}
                onPress={handleReset}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitText}>
                  {loading ? 'Sending...' : 'Send reset link ✦'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  inner: { flex: 1, padding: 32, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 24, left: 32 },
  backText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    color: '#9B7FA6',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'CormorantGaramond',
    fontSize: 36,
    color: '#F0ECE4',
    marginBottom: 12,
  },
  sub: {
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#5A5650',
    lineHeight: 22,
    marginBottom: 32,
  },
  errorBox: {
    backgroundColor: 'rgba(240,153,123,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(240,153,123,0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#F0997B',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8,
    padding: 16,
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    color: '#F0ECE4',
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: '#C9AB85',
    padding: 18,
    alignItems: 'center',
    borderRadius: 2,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#13111A',
  },
  successBox: {
    backgroundColor: 'rgba(159,225,203,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(159,225,203,0.2)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  successText: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 17,
    color: '#9fe1cb',
    textAlign: 'center',
  },
  backToLogin: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  backToLoginText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    color: '#C9AB85',
    textTransform: 'uppercase',
  },
});