import { COLORS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function RemoteScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Universal Remote</Text>
          <Text style={styles.subtitle}>Target: TCL Google TV</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Disconnected</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Explicit default export at the bottom makes Expo Router happy
export default RemoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '85%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: COLORS.errorBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  statusText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 12,
  },
});