import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { StatusBar as RNStatusBar, Platform } from 'react-native';

import { StoreProvider } from '@/context/store-context';
import { CartModal } from '@/components/cart-modal';
import { ToastBanner } from '@/components/toast-banner';
import { SkincareColors } from '@/constants/skincare-theme';

// Keep splash screen visible until assets are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    SystemUI.setBackgroundColorAsync(SkincareColors.background).catch(() => {});
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent');
      RNStatusBar.setBarStyle('dark-content');
    }
  }, []);

  return (
    <StoreProvider>
      {Platform.OS === 'android' ? (
        <RNStatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
      ) : (
        <StatusBar style="dark" />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: SkincareColors.background },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="product/[id]" />
      </Stack>
      <CartModal />
      <ToastBanner />
    </StoreProvider>
  );
}
