// Suppress missing declaration file error for this module
// @ts-ignore: Could not find declaration file for module 'react-native-zeroconf'.
import Zeroconf, {Service} from 'react-native-zeroconf'


export interface DiscoveredTv {
    name: string;
    ip: string;
    port: number
}

export class TVScanner {
    private static zeroconf = new Zeroconf();
    private static tvList: Map<string, DiscoveredTv> = new Map();

    /**
   * Starts scanning the local Wi-Fi for Android TVs
   * @param onDeviceFound Callback triggered every time a new TV is found
   */

    static startScan(onDeviceFound: (tvs: DiscoveredTv[]) => void){
        this.tvList.clear();

        //listen for resolved services
        this.zeroconf.on('resolved', (service: Service) => {
            //ensure we have valid ip address
            if (service.addresses && service.addresses.length > 0) {
                const newTv: DiscoveredTv = {
                    name: service.name || 'Smart TV',
                    ip: service.addresses[0],
                    port: service.port,
                };

                //prevent duplicates using ip as a unique key
                this.tvList.set(newTv.ip, newTv)
                console.log(`Found TV: ${newTv.name} at ${newTv.ip}`);

                //return the updated array of Tv's to the UI
                onDeviceFound(Array.from(this.tvList.values()));
                this.stopScan();
            }
        });

        this.zeroconf.on('error', (err: any) => {
            console.error(' Scanner Error:', err);
        });

        console.log('Scanning Wi-Fi for Android TVs...');

        // Android TV Remote v2 broadcasts on '_androidtvremote2._tcp'
        // We scan specifically for that protocol
        this.zeroconf.scan('androidtvremote2', 'tcp', 'local.');
    }

    static stopScan(){
        console.log('Stopping TV Scan');
        this.zeroconf.stop();
        this.zeroconf.removeDeviceListeners();
    }
}

