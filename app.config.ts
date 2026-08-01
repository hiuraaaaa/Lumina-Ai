import { ExpoConfig, ConfigContext } from 'expo/config';
import edgeToEdge from 'react-native-edge-to-edge/expo';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Nefu AI',
  slug: 'nefu-ai',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#08080a',
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
    package: 'com.nefuai.app',
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
  scheme: 'nefuai',
  experiments: {
    typedRoutes: true,
  },
  // TODO: isi extra.eas.projectId kalau mau pakai EAS Build punya sendiri
  // (jalankan `eas init` di project ini)
});
