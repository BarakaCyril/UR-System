import { COLORS } from '@/constants/theme';
import { Button } from '@react-navigation/elements';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const LAPTOP_IP = '192.168.100.199'

function RemoteScreen() {
  const [testStatus, setTestStatus] = useState('Not tested');

  const testConnection = async ()=> {
    try{
      setTestStatus('Testing...');

      const response = await fetch(`http://${LAPTOP_IP}:3000/ping`);
      const text = await response.text();

      setTestStatus(`Success: ${text}`);
      Alert.alert("It worked", `server said ${text}`);


    }catch(err){
      setTestStatus("failed to connect");
      Alert.alert("Connection failed", "Could not reach the laptop")
    }

  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Universal Remote</Text>
          <Text style={styles.subtitle}>Target: TCL Google TV</Text>


          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{testStatus}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={testConnection}>
            <Text style={styles.buttonText}>Ping Laptop Server</Text>
          </TouchableOpacity>

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
  button: {
    backgroundColor: '#00cc66', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, marginTop: 18
  },
  buttonText: {
    color: '#ffffff', fontWeight: '600', fontSize: 12
  }
});