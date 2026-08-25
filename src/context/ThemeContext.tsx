import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

const THEME_KEY = '@allura_theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
  // ✅ FIXED: Allow BOTH dark and light colors
  colors: typeof Colors.dark | typeof Colors.light; 
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  colors: Colors.dark, 
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved !== null) setIsDark(JSON.parse(saved));
      else setIsDark(systemScheme === 'dark');
    });
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDark(value);
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(value));
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: isDark ? Colors.dark : Colors.light }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);