import { requireNativeModule } from 'expo-modules-core';

// 1. Pull the native module proxy object
const ExpoTvTlsModule = requireNativeModule('ExpoTvTls');

export async function connectTLS(host: string, port: number, certPem: string, keyPem: string): Promise<boolean> {
  return await ExpoTvTlsModule.connect(host, port, certPem, keyPem);
}

export function sendTLS(base64Data: string) {
  return ExpoTvTlsModule.send(base64Data);
}

export function disconnectTLS() {
  return ExpoTvTlsModule.disconnect();
}

// 2. Call .addListener directly on the native module object!
export function addDataListener(listener: (event: { data: string }) => void) {
  return ExpoTvTlsModule.addListener('onData', listener);
}

export function addErrorListener(listener: (event: { error: string }) => void) {
  return ExpoTvTlsModule.addListener('onError', listener);
}

export function addCloseListener(listener: () => void) {
  return ExpoTvTlsModule.addListener('onClose', listener);
}