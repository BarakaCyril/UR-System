import { registerWebModule, NativeModule } from 'expo';

class ExpoTvTlsModule extends NativeModule<{}> {}

export default registerWebModule(ExpoTvTlsModule, 'ExpoTvTlsModule');
