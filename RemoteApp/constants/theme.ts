import { Background } from "@react-navigation/elements";
import { TextStyle, ViewStyle } from "react-native";


export const theme = {
  colors: {
    background: '#0b1326',
    surface: '#0b1326',
    surfaceDim: '#0b1326',
    surfaceBright: '#31394d',
    surfaceContainerLowest: '#060e20',
    surfaceContainerLow: '#131b2e',
    surfaceContainer: '#171f33',
    surfaceContainerHigh: '#222a3d',
    surfaceContainerHighest: '#2d3449',
    onSurface: '#dae2fd',
    onSurfaceVariant: '#c4c7c9',
    inverseSurface: '#dae2fd',
    inverseOnSurface: '#283044',
    outline: '#8e9193',
    outlineVariant: '#444749',
    surfaceTint: '#c4c7c9',
    primary: '#ffffff',
    onPrimary: '#2d3133',
    primaryContainer: '#e0e3e5',
    onPrimaryContainer: '#626567',
    inversePrimary: '#5c5f61',
    secondary: '#b7c8e1',
    onSecondary: '#213145',
    secondaryContainer: '#3a4a5f',
    onSecondaryContainer: '#a9bad3',
    tertiary: '#ffffff',
    onTertiary: '#32302a',
    tertiaryContainer: '#e7e2d9',
    onTertiaryContainer: '#67645d',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
  },

  rounded: {
    sm: 4,
    default: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999
  },

  spacing: {
    base: 8,
    touchtTargetMin: 48,
    safeMargin: 24,
    gutter: 16,
    stackGap: 12,
  },

  typography: {
    displayLg: {
      fontFamily: 'Manrope-Bold',
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.64, // Converted -0.02em to scale pixels
    } as TextStyle,
    headlineMd: {
      fontFamily: 'Manrope-SemiBold',
      fontSize: 20,
      lineHeight: 28,
    } as TextStyle,
    bodyLg: {
      fontFamily: 'Manrope-Regular',
      fontSize: 18,
      lineHeight: 28,
    } as TextStyle,
    bodySm: {
      fontFamily: 'Manrope-Regular',
      fontSize: 14,
      lineHeight: 21,
    } as TextStyle,
    labelCaps: {
      fontFamily: 'JetBrainsMono-Medium',
      fontSize: 12,
      lineHeight: 12,
      letterSpacing: 1.2, // 0.1em tracking
    } as TextStyle,
  }
};


export type AppTheme = typeof theme;