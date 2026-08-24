import { useEffect } from 'react';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  DancingScript_400Regular,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Raleway_200ExtraLight,
  Raleway_300Light,
  Raleway_400Regular,
} from '@expo-google-fonts/raleway';
import {
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
} from '@expo-google-fonts/jost';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [fontsLoaded] = useFonts({
    DancingScript:            DancingScript_400Regular,
    DancingScript_SemiBold:   DancingScript_600SemiBold,
    DancingScript_Bold:       DancingScript_700Bold,
    CormorantGaramond:        CormorantGaramond_300Light,
    CormorantGaramond_Reg:    CormorantGaramond_400Regular,
    CormorantGaramond_Italic: CormorantGaramond_300Light_Italic,
    CormorantGaramond_RegItalic: CormorantGaramond_400Regular_Italic,
    Raleway:                  Raleway_300Light,
    Raleway_ExtraLight:       Raleway_200ExtraLight,
    Raleway_Regular:          Raleway_400Regular,
    Jost:                     Jost_300Light,
    Jost_Regular:             Jost_400Regular,
    Jost_Medium:              Jost_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen name="context" />
        <Stack.Screen name="result" />
        <Stack.Screen name="outfit-detail" />
        <Stack.Screen name="wardrobe" />
        <Stack.Screen name="wardrobe-add" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="profile" />
      </Stack>
    </SafeAreaProvider>
  );
}

