export default {
  expo: {
    name: 'TSL Super League',
    slug: 'tsl-super-league',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0F',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.tsl.superleague',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0A0A0F',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: 'com.tsl.superleague',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
      socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3001',
    },
    plugins: ['expo-secure-store'],
  },
};
