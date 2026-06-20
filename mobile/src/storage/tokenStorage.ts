import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'tsl_access_token';
const REFRESH_TOKEN_KEY = 'tsl_refresh_token';

const isWeb = Platform.OS === 'web';

async function setItem(key: string, value: string) {
  if (isWeb) {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string) {
  if (isWeb) {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (isWeb) {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const tokenStorage = {
  async getAccessToken() {
    return getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string) {
    await setItem(ACCESS_TOKEN_KEY, accessToken);
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clearTokens() {
    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },
};
