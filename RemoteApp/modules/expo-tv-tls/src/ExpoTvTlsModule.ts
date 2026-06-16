import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoTvTlsModule extends NativeModule<{}> {}

export default requireNativeModule<ExpoTvTlsModule>('ExpoTvTls');
