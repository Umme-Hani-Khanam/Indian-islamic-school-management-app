import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  let token = null;
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token');
    }
  } else {
    token = await SecureStore.getItemAsync('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
