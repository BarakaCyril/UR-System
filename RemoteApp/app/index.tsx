import React from 'react';
import {Platform } from 'react-native';
import { useTVConnection } from './useTvConnection';

import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import RemoteScreen from './RemoteScreen';

SplashScreen.preventAutoHideAsync();

//define a funtional component
const MainScreen: React.FC = ()=> {

  const { sendCommand } = useTVConnection();

  const [fontsLoaded, fontError] = useFonts({
    'Manrope-Regular': require('../assets/fonts/Manrope-Regular.ttf'),
    'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  });

  useEffect(()=> {
    if (fontsLoaded || fontError){
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return(
    <RemoteScreen></RemoteScreen>
  )
}

export default MainScreen;
