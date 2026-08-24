// src/components/ThemedScreen.tsx
// Use this instead of SafeAreaView in ALL screens
import { View, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function ThemedScreen({ children, noPadding }: Props) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: noPadding ? 0 : insets.bottom,
      }
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});