import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Svg, { Circle, Path, Polygon, Line, G, Defs, RadialGradient, Stop } from 'react-native-svg';

const Ornament = ({ size = 120 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <Defs>
      <RadialGradient id="petalGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#C9AB85" stopOpacity="0.35" />
        <Stop offset="60%" stopColor="#C9AB85" stopOpacity="0.1" />
        <Stop offset="100%" stopColor="#13111A" stopOpacity="0" />
      </RadialGradient>
    </Defs>

    <Circle cx="100" cy="100" r="75" fill="url(#petalGlow)" />
    <Circle cx="100" cy="100" r="85" stroke="#C9AB85" strokeWidth="0.8" opacity={0.5} />
    <Circle cx="100" cy="100" r="70" stroke="#C9AB85" strokeWidth="0.6" opacity={0.35} />
    <Line x1="100" y1="30" x2="100" y2="170" stroke="#C9AB85" strokeWidth="0.5" opacity={0.3} />
    <Line x1="30" y1="100" x2="170" y2="100" stroke="#C9AB85" strokeWidth="0.5" opacity={0.3} />
    <Polygon points="100,88 112,100 100,112 88,100" stroke="#C9AB85" strokeWidth="1" fill="#13111A" />
    <Circle cx="100" cy="100" r="2.5" fill="#C9AB85" />
    <Path d="M 100,45 C 92,58 92,78 100,88 C 108,78 108,58 100,45 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.8" />
    <Path d="M 100,155 C 92,142 92,122 100,112 C 108,122 108,142 100,155 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.8" />
    <Path d="M 45,100 C 58,92 78,92 88,100 C 78,108 58,108 45,100 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.8" />
    <Path d="M 155,100 C 142,92 122,92 112,100 C 122,108 142,108 155,100 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.8" />
    <G transform="translate(108, 62) rotate(42)">
      <Path d="M 0,-24 C -8,-14 -8,-5 0,0 C 8,-5 8,-14 0,-24 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.7" />
    </G>
    <G transform="translate(138, 108) rotate(132)">
      <Path d="M 0,-24 C -8,-14 -8,-5 0,0 C 8,-5 8,-14 0,-24 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.7" />
    </G>
    <G transform="translate(92, 138) rotate(222)">
      <Path d="M 0,-24 C -8,-14 -8,-5 0,0 C 8,-5 8,-14 0,-24 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.7" />
    </G>
    <G transform="translate(62, 92) rotate(312)">
      <Path d="M 0,-24 C -8,-14 -8,-5 0,0 C 8,-5 8,-14 0,-24 Z" fill="#13111A" stroke="#C9AB85" strokeWidth="0.7" />
    </G>
  </Svg>
);

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scale = width / 375;

  const [checking, setChecking] = useState(true);

  const ornamentOpacity = useRef(new Animated.Value(0)).current;
  const ornamentY       = useRef(new Animated.Value(24)).current;
  const titleOpacity    = useRef(new Animated.Value(0)).current;
  const titleY          = useRef(new Animated.Value(24)).current;
  const dividerOpacity  = useRef(new Animated.Value(0)).current;
  const taglineOpacity  = useRef(new Animated.Value(0)).current;
  const taglineY        = useRef(new Animated.Value(16)).current;
  const buttonOpacity   = useRef(new Animated.Value(0)).current;
  const buttonY         = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ornamentOpacity, { toValue: 1, duration: 1200, delay: 400, useNativeDriver: true }),
        Animated.timing(ornamentY, { toValue: 0, duration: 1200, delay: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 1000, delay: 0, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 1000, delay: 0, useNativeDriver: true }),
      ]),
      Animated.timing(dividerOpacity, { toValue: 1, duration: 600, delay: 0, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 1000, delay: 0, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 1000, delay: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 900, delay: 400, useNativeDriver: true }),
        Animated.timing(buttonY, { toValue: 0, duration: 900, delay: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setChecking(false); // ✅ Show Splash / let button work
        return;
      }

      // ✅ FIXED: Check if they have a profile before sending to Home
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, style_preferences')
        .eq('user_id', session.user.id)
        .single();

      // If they DON'T have a profile yet, send them to ONBOARDING
      if (!profile || !profile.display_name || !profile.style_preferences) {
        router.replace('/onboarding');
      } else {
        router.replace('/home');
      }
    };
    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#13111A" />

      <Animated.View style={[
        styles.ornamentWrap,
        { opacity: ornamentOpacity, transform: [{ translateY: ornamentY }] }
      ]}>
        <Ornament size={Math.round(110 * scale)} />
      </Animated.View>

      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.title,
          { fontSize: Math.round(26 * scale), opacity: titleOpacity, transform: [{ translateY: titleY }] }
        ]}
      >
        ALLURA
      </Animated.Text>

      <Animated.View style={[styles.divider, { opacity: dividerOpacity }]} />

      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.tagline,
          { fontSize: Math.round(14 * scale), opacity: taglineOpacity, transform: [{ translateY: taglineY }] }
        ]}
      >
        Don't guess your style. Know it.
      </Animated.Text>

      <Animated.View style={[
        styles.buttonWrap,
        { opacity: buttonOpacity, transform: [{ translateY: buttonY }] }
      ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/auth' as any)}
          activeOpacity={0.75}
        >
          <Text allowFontScaling={false} style={styles.buttonText}>
            LET'S GET STARTED
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13111A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ornamentWrap: {
    marginBottom: 28,
  },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    letterSpacing: 10,
    color: '#F0ECE4',
    textAlign: 'center',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(201, 171, 133, 0.4)',
    marginVertical: 18,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    color: '#C9AB85',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.85,
  },
  buttonWrap: {
    width: '100%',
    maxWidth: 280,
  },
  button: {
    borderWidth: 1,
    borderColor: '#C9AB85',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 4,
    color: '#C9AB85',
    textAlign: 'center',
  },
});