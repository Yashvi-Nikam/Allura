import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';

const THEME_KEY = '@allura_theme';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved !== null) {
        setIsDark(JSON.parse(saved));
      } else {
        setIsDark(systemScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async (value: boolean) => {
    setIsDark(value);
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDark ? Colors.dark : Colors.light;

  return { isDark, toggleTheme, colors };
};