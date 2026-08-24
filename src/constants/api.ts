import { Platform } from 'react-native';

export const API_URL = Platform.select({
  android: 'http://10.193.245.9:5000',
  ios:     'http://10.193.245.9:5000',
  default: 'http://10.193.245.9:5000',
});

export const api = {
  profile:         `${API_URL}/api/profile`,
  wardrobe:        `${API_URL}/api/wardrobe`,
  recommendations: `${API_URL}/api/recommendations`,
};