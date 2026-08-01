import { ExpoConfig, ConfigContext } from 'expo/config';
import edgeToEdge from 'react-native-edge-to-edge/expo';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Lumina',
  slug: 'lumina',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#08080a',
  },
  updates: {
    url: 'https://u.expo.dev/5e9c90d8-6e1d-4047-b229-5f04cc627d45',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#F4CB7A',
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#08080a',
    },
    // TODO: ganti package name kalau mau publish sendiri
    package: 'com.lumina.app',
    jsEngine: 'hermes',
    enableProguardInReleaseBuilds: true,
    enableShrinkResourcesInReleaseBuilds: true,
    targetSdkVersion: 35,
  },
  plugins: [
    edgeToEdge({
      android: {
        parentTheme: 'Default',
        enforceNavigationBarContrast: false,
      },
    }),
    './plugins/withDarkBackground',
    'expo-router',
    ['expo-build-properties', {
      android: {
        kotlinVersion: '2.1.20',
        newArchEnabled: true,
      },
    }],
    ['expo-font', { fonts: [] }],
  ],
  scheme: 'lumina',
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '5e9c90d8-6e1d-4047-b229-5f04cc627d45',
    },
  },
});
