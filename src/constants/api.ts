import { Platform } from 'react-native';

export const API_URL = Platform.select({
  android: 'http://192.168.1.7:5000',
  ios:     'http://192.168.1.7:5000',
  default: 'http://192.168.1.7:5000',
});

export const api = {
  profile:         `${API_URL}/api/profile`,
  wardrobe:        `${API_URL}/api/wardrobe`,
  recommendations: `${API_URL}/api/recommendations`,
};