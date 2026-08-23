import { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import ContextChip from '@/components/ContextChip';
import { useWardrobe } from '@/hooks/useWardrobe';

const CATEGORIES = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Footwear', 'Bag', 'Accessory'];
const STYLES     = ['Casual', 'Chic', 'Formal', 'Streetwear', 'Ethnic', 'Minimalist', 'Romantic'];
const FORMALITY  = ['Casual', 'Smart casual', 'Formal', 'Traditional'];
const SEASONS    = ['All seasons', 'Summer', 'Winter', 'Monsoon'];

export default function WardrobeAdd() {
  const router = useRouter();
  const { addItem, loading } = useWardrobe();

  const [category,   setCategory]   = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [color,      setColor]      = useState('');
  const [style,      setStyle]      = useState('');
  const [formality,  setFormality]  = useState('');
  const [season,     setSeason]     = useState('');
  const [notes,      setNotes]      = useState('');

  const handleSave = async () => {
    if (!category || !color) return;
    await addItem({
      user_id: 'demo-user-001',
      manual_data: {
        category:    category.toLowerCase(),
        subcategory: subcategory || category.toLowerCase(),
        color,
        style:       style.toLowerCase(),
        formality:   formality.toLowerCase(),
        season:      season === 'All seasons' ? 'all' : season.toLowerCase(),
        fabric_feel: 'Not specified',
      },
      user_notes: notes,
    } as any);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add to Wardrobe</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveBtn, loading && styles.saveBtnDisabled]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scan option */}
        <View style={styles.scanBox}>
          <Text style={styles.scanTitle}>📷 Scan or upload a photo</Text>
          <Text style={styles.scanSub}>Allura will identify the item for you</Text>
          <TouchableOpacity style={styles.scanBtn}>
            <Text style={styles.scanBtnText}>Choose photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or add manually</Text>
          <View style={styles.orLine} />
        </View>

        <Section label="Category">
          <View style={styles.chips}>
            {CATEGORIES.map(c => (
              <ContextChip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </Section>

        <Section label="Describe the item">
          <TextInput
            style={styles.input}
            placeholder="e.g. wide-leg trousers, silk blouse, block heels..."
            placeholderTextColor="#5A5650"
            value={subcategory}
            onChangeText={setSubcategory}
          />
        </Section>

        <Section label="Primary color">
          <TextInput
            style={styles.input}
            placeholder="e.g. cherry red, ivory, dark blue..."
            placeholderTextColor="#5A5650"
            value={color}
            onChangeText={setColor}
          />
        </Section>

        <Section label="Style">
          <View style={styles.chips}>
            {STYLES.map(s => (
              <ContextChip key={s} label={s} selected={style === s} onPress={() => setStyle(s)} />
            ))}
          </View>
        </Section>

        <Section label="Formality">
          <View style={styles.chips}>
            {FORMALITY.map(f => (
              <ContextChip key={f} label={f} selected={formality === f} onPress={() => setFormality(f)} />
            ))}
          </View>
        </Section>

        <Section label="Season">
          <View style={styles.chips}>
            {SEASONS.map(s => (
              <ContextChip key={s} label={s} selected={season === s} onPress={() => setSeason(s)} />
            ))}
          </View>
        </Section>

        <Section label="Notes (optional)">
          <TextInput
            style={[styles.input, styles.inputTall]}
            placeholder="Any notes about this item..."
            placeholderTextColor="#5A5650"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Section>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Saving...' : 'Add to wardrobe ✦'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { padding: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20,
    color: '#F0ECE4',
  },
  saveBtn: {
    fontFamily: 'Raleway',
    fontSize: 12,
    letterSpacing: 1,
    color: '#C9AB85',
  },
  saveBtnDisabled: { opacity: 0.4 },
  scanBox: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  scanTitle: {
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    color: '#F0ECE4',
  },
  scanSub: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#5A5650',
  },
  scanBtn: {
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  scanBtnText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    color: '#C9AB85',
    textTransform: 'uppercase',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: 'rgba(201,171,133,0.1)',
  },
  orText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8,
    padding: 14,
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#F0ECE4',
  },
  inputTall: { height: 80, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#C9AB85',
    padding: 18,
    alignItems: 'center',
    borderRadius: 2,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#13111A',
  },
});