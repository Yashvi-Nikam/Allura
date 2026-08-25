import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import ContextChip from '@/components/ContextChip';
import { useTheme } from '@/context/ThemeContext';

const STYLE_OPTIONS   = ['Casual', 'Chic', 'Streetwear', 'Minimalist', 'Ethnic', 'Bohemian', 'Romantic', 'Formal'];
const COMFORT_OPTIONS = ['Modest', 'Balanced', 'Expressive'];
const BODY_OPTIONS    = ['More coverage', 'Defined waist', 'Relaxed silhouette', 'Flowy', 'Structured'];
const CULTURE_OPTIONS = ['Indian-first', 'Western', 'Fusion', 'Occasion-based'];
const SILHOUETTES     = ['Petite', 'Average', 'Tall', 'Plus'];

export default function BodyStyle() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [silhouette, setSilhouette] = useState('');
  const [styles_, setStyles] = useState<string[]>([]);
  const [comfort, setComfort] = useState('');
  const [body, setBody] = useState<string[]>([]);
  const [culture, setCulture] = useState('');

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please log in');
        router.back();
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (profile) {
        setName(profile.display_name || '');
        setSilhouette(profile.body_preferences?.silhouette || profile.style_preferences?.silhouette || '');
        setStyles(profile.style_preferences?.styles || []);
        setComfort(profile.comfort_preferences?.level || '');
        setBody(profile.body_preferences?.preferences || []);
        setCulture(profile.cultural_preferences?.style || '');
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Could not load your preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleArray = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const updatedProfile = {
        user_id: user.id, // ✅ FIXED: Removed 'id: user.id'
        display_name: name,
        style_preferences: { styles: styles_, silhouette: silhouette },
        comfort_preferences: { level: comfort },
        body_preferences: { preferences: body, silhouette: silhouette },
        cultural_preferences: { style: culture },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updatedProfile, { onConflict: 'user_id' }); // ✅ FIXED

      if (error) throw error;

      Alert.alert('Success', 'Your preferences have been updated!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#C9AB85" size="large" />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading your preferences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: colors.gold }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Body & Style</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, { color: colors.gold }, saving && { opacity: 0.5 }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Personal Information</Text>
          <Text style={[styles.label, { color: colors.mauve }]}>What's your name?</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.text, borderColor: colors.border }]}
            placeholder="Your name..."
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Body Silhouette</Text>
          <View style={styles.silouetteRow}>
            {SILHOUETTES.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.silouetteBtn,
                  { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
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

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Your Style</Text>
          <Text style={[styles.fieldHint, { color: colors.textMuted }]}>Pick all that feel like you.</Text>
          <View style={styles.chipsWrap}>
            {STYLE_OPTIONS.map(s => (
              <ContextChip key={s} label={s} selected={styles_.includes(s)} onPress={() => toggleArray(styles_, s, setStyles)} />
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Comfort & Coverage</Text>
          <Text style={[styles.label, { color: colors.mauve }]}>Comfort level</Text>
          <View style={styles.chipsWrap}>
            {COMFORT_OPTIONS.map(s => (
              <ContextChip key={s} label={s} selected={comfort === s} onPress={() => setComfort(s)} />
            ))}
          </View>

          <Text style={[styles.label, { color: colors.mauve, marginTop: 24 }]}>Body preferences</Text>
          <Text style={[styles.fieldHint, { color: colors.textMuted }]}>These help Allura suggest styles that suit YOUR preferences.</Text>
          <View style={styles.chipsWrap}>
            {BODY_OPTIONS.map(s => (
              <ContextChip key={s} label={s} selected={body.includes(s)} onPress={() => toggleArray(body, s, setBody)} />
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Cultural Vibe</Text>
          <View style={styles.chipsWrap}>
            {CULTURE_OPTIONS.map(s => (
              <ContextChip key={s} label={s} selected={culture === s} onPress={() => setCulture(s)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  back: { fontSize: 22 },
  title: { fontFamily: 'CormorantGaramond_Reg', fontSize: 20 },
  saveBtn: { fontFamily: 'Raleway', fontSize: 12, letterSpacing: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontFamily: 'Jost_Regular', fontSize: 16 },
  section: { borderRadius: 16, padding: 20, borderWidth: 0.5, marginBottom: 24 },
  sectionLabel: { fontFamily: 'Raleway', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  label: { fontFamily: 'Raleway', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, marginTop: 8 },
  fieldHint: { fontFamily: 'Jost', fontSize: 12, marginBottom: 12, lineHeight: 18 },
  input: { borderWidth: 0.5, borderRadius: 8, padding: 14, fontFamily: 'Jost_Regular', fontSize: 15, marginBottom: 12 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  silouetteRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  silouetteBtn: { borderWidth: 0.5, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20 },
  silouetteText: { fontFamily: 'Jost_Regular', fontSize: 13 },
});