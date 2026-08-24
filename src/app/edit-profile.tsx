import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Image, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setName(user.user_metadata?.display_name || '');
      
      if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      } else {
        const fileName = `${user.id}/avatar.jpg`;
        const { data: signedData } = await supabase.storage
          .from('avatars')
          .createSignedUrl(fileName, 60 * 60 * 24 * 365);
          
        if (signedData?.signedUrl) {
          setAvatarUrl(signedData.signedUrl);
        }
      }
    }
  };

  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow access to your photo library to change your photo.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setUploading(true);
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500, height: 500 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const fileName = `${user.id}/avatar.jpg`;
        const arrayBuffer = await fetch(manipulatedImage.uri).then(res => res.arrayBuffer());

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

        if (uploadError) throw uploadError;

        const { data: signedData, error: signedError } = await supabase.storage
          .from('avatars')
          .createSignedUrl(fileName, 60 * 60 * 24 * 365);

        if (signedError || !signedData) throw signedError;

        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: signedData.signedUrl }
        });

        if (updateError) throw updateError;

        setAvatarUrl(signedData.signedUrl);
        Alert.alert('Success', 'Profile photo updated!');

      } catch (e: any) {
        Alert.alert('Error', e.message || 'Could not upload photo');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: name }
      });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => router.back(), 1500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, saving && { opacity: 0.5 }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {saved ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>✦ Profile updated!</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>✦</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.cameraBtn} 
              onPress={pickAndUploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.cameraBtnText}>+</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
            <Text style={styles.avatarHint}>
              {uploading ? 'Uploading...' : 'Tap to change profile photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#5A5650"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.hint}>
          This is how Allura will address you throughout the app.
        </Text>
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
  scroll: { padding: 24 },
  successBox: {
    backgroundColor: 'rgba(159,225,203,0.08)',
    borderWidth: 0.5, borderColor: 'rgba(159,225,203,0.2)',
    borderRadius: 8, padding: 12, marginBottom: 16,
  },
  successText: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 15, color: '#9fe1cb', textAlign: 'center',
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 36, gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.3)',
  },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#2A2438',
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 30, color: '#C9AB85' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0, right: 0,
    backgroundColor: '#C9AB85',
    width: 28, height: 28,
    borderRadius: 14,
    borderWidth: 2, borderColor: '#13111A',
    alignItems: 'center', justifyContent: 'center',
  },
  cameraBtnText: {
    color: '#13111A', fontSize: 18, fontWeight: 'bold', lineHeight: 20,
  },
  avatarHint: {
    fontFamily: 'Jost', fontSize: 12, color: '#C9AB85',
  },
  label: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 2, textTransform: 'uppercase',
    color: '#9B7FA6', marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8, padding: 16,
    fontFamily: 'Jost_Regular', fontSize: 15, color: '#F0ECE4',
    marginBottom: 12,
  },
  hint: {
    fontFamily: 'Jost', fontSize: 12,
    color: '#5A5650', lineHeight: 18,
  },
});