import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import ContextChip from '@/components/ContextChip';

// EXACT SAME OPTIONS AS YOUR ONBOARDING
const STYLE_OPTIONS   = ['Casual', 'Chic', 'Streetwear', 'Minimalist', 'Ethnic', 'Bohemian', 'Romantic', 'Formal'];
const COMFORT_OPTIONS = ['Modest', 'Balanced', 'Expressive'];
const BODY_OPTIONS    = ['More coverage', 'Defined waist', 'Relaxed silhouette', 'Flowy', 'Structured'];
const CULTURE_OPTIONS = ['Indian-first', 'Western', 'Fusion', 'Occasion-based'];
const SILHOUETTES     = ['Petite', 'Average', 'Tall', 'Plus'];

export default function BodyStyle() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state (matching onboarding)
  const [name, setName] = useState('');
  const [silhouette, setSilhouette] = useState('');
  const [styles_, setStyles] = useState<string[]>([]); // Renamed to styles_ to avoid conflict
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
        // Set silhouette (checking both body_preferences and style_preferences)
        setSilhouette(profile.body_preferences?.silhouette || profile.style_preferences?.silhouette || '');
        // Set arrays from DB
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

  // Copy of onboarding toggle logic
  const toggleArray = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const updatedProfile = {
        id: user.id,
        user_id: user.id,
        display_name: name,
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
        .upsert(updatedProfile);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#C9AB85" size="large" />
          <Text style={styles.loadingText}>Loading your preferences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Body & Style</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, saving && { opacity: 0.5 }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name Input (Same as onboarding) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Personal Information</Text>
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name..."
            placeholderTextColor="#5A5650"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* Silhouette (Same as onboarding Step 1) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Body Silhouette</Text>
          <View style={styles.silouetteRow}>
            {SILHOUETTES.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.silouetteBtn,
                  silhouette === s && styles.silouetteBtnActive,
                ]}
                onPress={() => setSilhouette(s)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.silouetteText,
                  silhouette === s && styles.silouetteTextActive,
                ]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Styles (Same as onboarding Step 2) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Style</Text>
          <Text style={styles.fieldHint}>Pick all that feel like you.</Text>
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

        {/* Comfort & Body (Same as onboarding Step 3) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Comfort & Coverage</Text>
          
          <Text style={styles.label}>Comfort level</Text>
          <View style={styles.chipsWrap}>
            {COMFORT_OPTIONS.map(s => (
              <ContextChip
                key={s} label={s}
                selected={comfort === s}
                onPress={() => setComfort(s)}
              />
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 24 }]}>Body preferences</Text>
          <Text style={styles.fieldHint}>
            These help Allura suggest styles that suit YOUR preferences.
          </Text>
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

        {/* Culture (Same as onboarding Step 4) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cultural Vibe</Text>
          <View style={styles.chipsWrap}>
            {CULTURE_OPTIONS.map(s => (
              <ContextChip
                key={s} label={s}
                selected={culture === s}
                onPress={() => setCulture(s)}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20, color: '#F0ECE4',
  },
  saveBtn: {
    fontFamily: 'Raleway', fontSize: 12,
    letterSpacing: 1, color: '#C9AB85',
  },
  scroll: { padding: 24, paddingBottom: 48 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: 'Jost_Regular',
    fontSize: 16,
    color: '#5A5650',
  },
  section: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 12,
    marginTop: 8,
  },
  fieldHint: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#5A5650',
    marginBottom: 12,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#2A2438',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8,
    padding: 14,
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    color: '#F0ECE4',
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  silouetteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  silouetteBtn: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1E1A2E',
  },
  silouetteBtnActive: {
    backgroundColor: 'rgba(201,171,133,0.15)',
    borderColor: '#C9AB85',
  },
  silouetteText: {
    fontFamily: 'Jost_Regular',
    fontSize: 13,
    color: '#C8C0B4',
  },
  silouetteTextActive: {
    color: '#C9AB85',
  },
});