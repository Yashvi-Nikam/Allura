import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';

import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import ContextChip from '@/components/ContextChip';
import { useWardrobe } from '@/hooks/useWardrobe';

const CATEGORIES = [
  'Top',
  'Bottom',
  'Dress',
  'Outerwear',
  'Footwear',
  'Bag',
  'Accessory',
];

const STYLES = [
  'Casual',
  'Chic',
  'Formal',
  'Streetwear',
  'Ethnic',
  'Minimalist',
  'Romantic',
];

const FORMALITY = [
  'Casual',
  'Smart casual',
  'Formal',
  'Traditional',
];

const SEASONS = [
  'All seasons',
  'Summer',
  'Winter',
  'Monsoon',
];

export default function WardrobeAdd() {
  const router = useRouter();

  const {
    addItem,
    loading,
  } = useWardrobe();

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] =
    useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');
  const [formality, setFormality] =
    useState('');
  const [season, setSeason] = useState('');
  const [notes, setNotes] = useState('');

  const [imageUri, setImageUri] =
    useState<string | null>(null);

  const [imageBase64, setImageBase64] =
    useState<string | null>(null);

  const [imageMimeType, setImageMimeType] =
    useState('image/jpeg');

  /**
   * Select a wardrobe image.
   *
   * The image is resized and compressed
   * BEFORE being converted to base64.
   *
   * This prevents the 413 Payload Too Large
   * error we were getting from huge phone images.
   */
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Photo permission needed',
          'Please allow Allura to access your photos so you can add wardrobe items.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.8,
          base64: false,
        });

      if (
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const asset = result.assets[0];

      setImageUri(asset.uri);

      /*
       * Compress and resize.
       */
      const manipulated =
        await ImageManipulator.manipulateAsync(
          asset.uri,
          [
            {
              resize: {
                width: 1200,
              },
            },
          ],
          {
            compress: 0.7,
            format:
              ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

      if (!manipulated.base64) {
        Alert.alert(
          'Could not process image',
          'Please try selecting the photo again.'
        );
        return;
      }

      setImageBase64(
        manipulated.base64
      );

      setImageMimeType('image/jpeg');

      console.log(
        'Wardrobe image prepared:',
        Math.round(
          manipulated.base64.length / 1024
        ),
        'KB base64'
      );
    } catch (error) {
      console.error(
        'Image picker error:',
        error
      );

      Alert.alert(
        'Photo error',
        'Something went wrong while selecting the image.'
      );
    }
  };

  const handleSave = async () => {
    if (!category || !color) {
      Alert.alert(
        'Almost there',
        'Please select a category and enter the primary color.'
      );
      return;
    }

    try {
      await addItem({
        image_base64:
          imageBase64 || undefined,

        image_mime_type:
          imageMimeType,

        manual_data: {
          category:
            category.toLowerCase(),

          subcategory:
            subcategory.trim() ||
            category.toLowerCase(),

          color:
            color.trim(),

          style:
            style.toLowerCase(),

          formality:
            formality.toLowerCase(),

          season:
            season === 'All seasons'
              ? 'all'
              : season.toLowerCase(),

          fabric_feel:
            'Not specified',
        },

        user_notes:
          notes.trim() || undefined,
      } as any);

      Alert.alert(
        'Added ✦',
        'Your item has been added to your wardrobe.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error(
        'Add wardrobe item error:',
        error
      );

      Alert.alert(
        'Could not add item',
        error?.response?.data?.error ||
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.back}>
              ←
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Add to Wardrobe
          </Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
          >
            <Text
              style={[
                styles.saveBtn,
                loading &&
                  styles.saveBtnDisabled,
              ]}
            >
              {loading
                ? 'Saving...'
                : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scan / upload */}
        <View style={styles.scanBox}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.scanTitle}>
              📷 Scan or upload a photo
            </Text>
          )}

          <Text style={styles.scanSub}>
            {imageUri
              ? 'Photo selected — Allura can identify the item'
              : 'Allura will identify the item for you'}
          </Text>

          <TouchableOpacity
            style={styles.scanBtn}
            onPress={pickImage}
            disabled={loading}
          >
            <Text style={styles.scanBtnText}>
              {imageUri
                ? 'Choose another photo'
                : 'Choose photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orRow}>
          <View style={styles.orLine} />

          <Text style={styles.orText}>
            or add manually
          </Text>

          <View style={styles.orLine} />
        </View>

        {/* Category */}
        <Section label="Category">
          <View style={styles.chips}>
            {CATEGORIES.map(c => (
              <ContextChip
                key={c}
                label={c}
                selected={
                  category === c
                }
                onPress={() =>
                  setCategory(c)
                }
              />
            ))}
          </View>
        </Section>

        {/* Subcategory */}
        <Section label="Describe the item">
          <TextInput
            style={styles.input}
            placeholder="e.g. wide-leg trousers, silk blouse, block heels..."
            placeholderTextColor="#5A5650"
            value={subcategory}
            onChangeText={
              setSubcategory
            }
          />
        </Section>

        {/* Color */}
        <Section label="Primary color">
          <TextInput
            style={styles.input}
            placeholder="e.g. cherry red, ivory, dark blue..."
            placeholderTextColor="#5A5650"
            value={color}
            onChangeText={setColor}
          />
        </Section>

        {/* Style */}
        <Section label="Style">
          <View style={styles.chips}>
            {STYLES.map(s => (
              <ContextChip
                key={s}
                label={s}
                selected={
                  style === s
                }
                onPress={() =>
                  setStyle(s)
                }
              />
            ))}
          </View>
        </Section>

        {/* Formality */}
        <Section label="Formality">
          <View style={styles.chips}>
            {FORMALITY.map(f => (
              <ContextChip
                key={f}
                label={f}
                selected={
                  formality === f
                }
                onPress={() =>
                  setFormality(f)
                }
              />
            ))}
          </View>
        </Section>

        {/* Season */}
        <Section label="Season">
          <View style={styles.chips}>
            {SEASONS.map(s => (
              <ContextChip
                key={s}
                label={s}
                selected={
                  season === s
                }
                onPress={() =>
                  setSeason(s)
                }
              />
            ))}
          </View>
        </Section>

        {/* Notes */}
        <Section label="Notes (optional)">
          <TextInput
            style={[
              styles.input,
              styles.inputTall,
            ]}
            placeholder="Any notes about this item..."
            placeholderTextColor="#5A5650"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Section>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            loading &&
              styles.submitBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading
              ? 'Saving...'
              : 'Add to wardrobe ✦'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>
      {label}
    </Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13111A',
  },

  scroll: {
    padding: 24,
    paddingBottom: 48,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  back: {
    fontSize: 22,
    color: '#C9AB85',
  },

  title: {
    fontFamily:
      'CormorantGaramond_Reg',
    fontSize: 20,
    color: '#F0ECE4',
  },

  saveBtn: {
    fontFamily: 'Raleway',
    fontSize: 12,
    letterSpacing: 1,
    color: '#C9AB85',
  },

  saveBtnDisabled: {
    opacity: 0.4,
  },

  scanBox: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    borderColor:
      'rgba(201,171,133,0.12)',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },

  preview: {
    width: 150,
    height: 190,
    borderRadius: 10,
    marginBottom: 8,
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
    textAlign: 'center',
  },

  scanBtn: {
    marginTop: 8,
    borderWidth: 0.5,
    borderColor:
      'rgba(201,171,133,0.3)',
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
    backgroundColor:
      'rgba(201,171,133,0.1)',
  },

  orText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'uppercase',
  },

  section: {
    marginBottom: 24,
  },

  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 12,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5,
    borderColor:
      'rgba(201,171,133,0.2)',
    borderRadius: 8,
    padding: 14,
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#F0ECE4',
  },

  inputTall: {
    height: 80,
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: '#C9AB85',
    padding: 18,
    alignItems: 'center',
    borderRadius: 2,
  },

  submitBtnDisabled: {
    opacity: 0.5,
  },

  submitText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#13111A',
  },
});