import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, 
  TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ContextChip from '@/components/ContextChip';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

const STYLE_OPTIONS   = ['Casual', 'Chic', 'Streetwear', 'Minimalist', 'Ethnic', 'Bohemian', 'Romantic', 'Formal'];
const COMFORT_OPTIONS = ['Modest', 'Balanced', 'Expressive'];
const BODY_OPTIONS    = ['More coverage', 'Defined waist', 'Relaxed silhouette', 'Flowy', 'Structured'];
const CULTURE_OPTIONS = ['Indian-first', 'Western', 'Fusion', 'Occasion-based'];
const SILHOUETTES     = ['Petite', 'Average', 'Tall', 'Plus'];

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step,       setStep]      = useState(1);
  const [name,       setName]      = useState('');
  const [silhouette, setSilhouette] = useState('');
  const [styles_,    setStyles]    = useState<string[]>([]);
  const [comfort,    setComfort]   = useState('');
  const [body,       setBody]      = useState<string[]>([]);
  const [culture,    setCulture]   = useState('');
  const [saving,     setSaving]    = useState(false);

  const toggleArray = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const saveAndContinue = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please log in first');
        router.replace('/auth');
        return;
      }

      const profileData = {
        user_id: user.id,
        display_name: name || user.email?.split('@')[0] || 'Allura User',
        style_preferences: {
          styles: styles_,
          silhouette: silhouette,
        },
        comfort_preferences: {
          level: comfort,
        },
        body_preferences: {
          preferences: body,
          silhouette: silhouette,
        },
        cultural_preferences: {
          style: culture,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { display_name: profileData.display_name }
      });

      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
      console.error('Onboarding error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.gold }]}>Allura</Text>
          <Text style={[styles.stepCount, { color: colors.textMuted }]}>Step {step} of 4</Text>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={[styles.heading, { color: colors.text }]}>Let's create your{'\n'}style persona ✦</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>This helps Allura style outfits that feel like you.</Text>

            <Text style={[styles.fieldLabel, { color: colors.mauve }]}>What's your name?</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Your name..."
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="done"
            />

            <Text style={[styles.fieldLabel, { color: colors.mauve }]}>Choose your body silhouette</Text>
            <View style={styles.silouetteRow}>
              {SILHOUETTES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.silouetteBtn,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    silhouette === s && { backgroundColor: colors.goldDim, borderColor: colors.gold },
                  ]}
                  onPress={() => setSilhouette(s)}
                  activeOpacity={0.75}
                >
                  <Text style={[
                    styles.silouetteText,
                    { color: colors.textSecondary },
                    silhouette === s && { color: colors.gold },
                  ]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={[styles.heading, { color: colors.text }]}>Your style ✦</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Pick all that feel like you.</Text>
            <View style={styles.chipsWrap}>
              {STYLE_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={styles_.includes(s)}
                  onPress={() => toggleArray(styles_, s, setStyles)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={[styles.heading, { color: colors.text }]}>Comfort & coverage ✦</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>How do you like to dress?</Text>

            <Text style={[styles.fieldLabel, { color: colors.mauve }]}>Comfort level</Text>
            <View style={styles.chipsWrap}>
              {COMFORT_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={comfort === s}
                  onPress={() => setComfort(s)}
                />
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.mauve, marginTop: 24 }]}>Body preferences</Text>
            <Text style={[styles.fieldHint, { color: colors.textMuted }]}>These help Allura suggest styles that suit YOUR preferences.</Text>
            <View style={styles.chipsWrap}>
              {BODY_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={body.includes(s)}
                  onPress={() => toggleArray(body, s, setBody)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={[styles.heading, { color: colors.text }]}>Your cultural vibe ✦</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Allura respects your style world — Indian, Western, or anywhere in between.</Text>
            <View style={styles.chipsWrap}>
              {CULTURE_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={culture === s}
                  onPress={() => setCulture(s)}
                />
              ))}
            </View>

            {name ? (
              <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.summaryTitle, { color: colors.gold }]}>Looking good, {name}! ✦</Text>
                {styles_.length > 0 && (
                  <Text style={[styles.summaryLine, { color: colors.textSecondary }]}>Style: {styles_.join(', ')}</Text>
                )}
                {comfort ? (
                  <Text style={[styles.summaryLine, { color: colors.textSecondary }]}>Comfort: {comfort}</Text>
                ) : null}
                {silhouette ? (
                  <Text style={[styles.summaryLine, { color: colors.textSecondary }]}>Silhouette: {silhouette}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.navRow}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: colors.border }]}
              onPress={() => setStep(s => s - 1)}
              activeOpacity={0.75}
            >
              <Text style={[styles.backText, { color: colors.textMuted }]}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: colors.gold }]}
            onPress={() => step < 4 ? setStep(s => s + 1) : saveAndContinue()}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Text style={[styles.nextText, { color: colors.background }]}>
              {saving ? 'Saving...' : step < 4 ? 'Next →' : 'Start styling ✦'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logo: { fontFamily: 'DancingScript', fontSize: 28 },
  stepCount: { fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  progressBg: { height: 1, backgroundColor: 'rgba(201,171,133,0.1)', marginBottom: 40 },
  progressFill: { height: 1, backgroundColor: '#C9AB85' },
  stepContent: { marginBottom: 32 },
  heading: { fontFamily: 'CormorantGaramond', fontSize: 34, lineHeight: 42, marginBottom: 8 },
  sub: { fontFamily: 'Jost', fontSize: 14, marginBottom: 32, lineHeight: 22 },
  fieldLabel: { fontFamily: 'Raleway', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  fieldHint: { fontFamily: 'Jost', fontSize: 12, marginBottom: 12, lineHeight: 18 },
  input: { borderWidth: 0.5, borderRadius: 8, padding: 16, marginBottom: 28, fontFamily: 'Jost_Regular', fontSize: 15 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  silouetteRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  silouetteBtn: { borderWidth: 0.5, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20 },
  silouetteText: { fontFamily: 'Jost_Regular', fontSize: 13 },
  summaryCard: { marginTop: 32, borderRadius: 16, padding: 20, borderWidth: 0.5, gap: 8 },
  summaryTitle: { fontFamily: 'CormorantGaramond_Reg', fontSize: 20, marginBottom: 4 },
  summaryLine: { fontFamily: 'Jost', fontSize: 13, lineHeight: 20, textTransform: 'capitalize' },
  navRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  backBtn: { paddingVertical: 15, paddingHorizontal: 24, borderWidth: 0.5, borderRadius: 2 },
  backText: { fontFamily: 'Raleway', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  nextBtn: { paddingVertical: 15, paddingHorizontal: 32, borderRadius: 2 },
  nextText: { fontFamily: 'Raleway', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
});