import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle, TouchableOpacity, PanResponder, FlatList, Modal } from 'react-native';
import { Home, ArrowLeft, Plus, Minus, VolumeX, MousePointer, Move, LayoutDashboard, Pointer, Settings2, PlayCircle, Tv } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { useTVConnection } from '../app/useTvConnection';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { CryptoManager } from "@/utils/CryptoManager";
import { PairingModal } from '@/components/PairingModal';
import { TVScanner, DiscoveredTv } from "@/utils/TVScanner";
import { TVConnectionManager } from "@/utils/TVConnectionManager";

const RemoteScreen: React.FC = () => {
  const { sendCommand } = useTVConnection();

  //tv scanning
  const [availableTVs, setAvailableTVs] = useState<DiscoveredTv[]>([]);
  const [isDeviceListVisible, setIsDeviceListVisible] = useState(false);

  useEffect(()=>{
    //start scanning on app opens
    TVScanner.startScan((tvs)=> {
      setAvailableTVs(tvs);
    });

    return () => {
      TVScanner.stopScan();
    }
  }, []);

  const handleConcectToTv = async (tv: DiscoveredTv) => {
    console.log(`Attempting to connect to ${tv.name}...`);
    // Stop scanning once we pick a TV to save battery
    TVScanner.stopScan();

    // Trigger the PIN modal and start the TLS handshake using the discovered IP
    setIsPairingVisible(true)
    await TVConnectionManager.startPairing(tv.ip);
  };

  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [volume, setVolume] = useState(30);

  //modal
  const [isPairingVisible, setIsPairingVisible] = useState(false);  
  const [isPairingLoading, setIsPairingLoading] = useState(false);

  const handlePairingSubmit = (pinCode: string) => {
    setIsPairingLoading(true);
    console.log("User typed verification PIN code: ", pinCode);

    //Simulate a netweok timeout delay
    setTimeout(()=>{
      setIsPairingLoading(false);
      setIsPairingVisible(false);
    }, 2000)
  };


  useEffect(()=>{
    async function initCrypto(){
      try{
        console.log("Starting Crypto check...");
        const identity = await CryptoManager.getClientIdentity();
        console.log("Ready to connect to TV! Cert length:", identity.certPem.length);
      }catch(err){
        console.error("Failed to init crypto:", err);
      }
    }

    initCrypto();
  }, []);

  //Gesture responder fo detecting swipes
  const swipeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: ()=> true,
      onPanResponderRelease: (_, gestureState) => {
        const {dx, dy} = gestureState;
        const swipeThreshold = 30; //max pixels to count as a swipe

        //if the movement is tiny, treat it as a center tap
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          sendCommand('DPAD_CENTER');
          return;
        }

        //determine horizontal or vertical
        if (Math.abs(dx) > Math.abs(dy)){
          if (dx > swipeThreshold) sendCommand('DPAD_RIGHT');
          else if (dx < -swipeThreshold) sendCommand('DPAD_LEFT');

        }else{
          if (dy <  -swipeThreshold) sendCommand('DPAD_DOWN');
          else if (dy > swipeThreshold) sendCommand('DPAD_UP');
        }
      }
    })
  ).current

  return(
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* HEADIGN N SHI */}
        <View style={styles.headerBar}>
          
          <TouchableOpacity
            style = {styles.listIcon}
            activeOpacity={0.7}
            onPress={() => setIsDeviceListVisible(true)}
          >
            <Tv color={theme.colors.onSurface} size={24}/>
            <View>
              <Text style={styles.brandText}>LA GRANDE CONTROL</Text>
              {/* Dynamic subtext to show scanning status */}
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>
                {availableTVs.length > 0 
                  ? `${availableTVs.length} TV(s) Found - Tap to connect` 
                  : 'Scanning network...'}
              </Text>

            </View>
          </TouchableOpacity>
          

          <TouchableOpacity style={styles.avatarCircle} activeOpacity={0.7}>
              <View style={styles.avatarInnerPill}></View>
          </TouchableOpacity>
        </View>


        {/*NAVIGATION AND DEVICE STATE*/}
        <View style = {styles.navZone}>
          <TouchableOpacity
            style = {styles.circleButton}
            onPress={()=> sendCommand('HOME')}
          >
            <Home color={theme.colors.onSurface} size={22} strokeWidth={2}/>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.subLabelCaps}>LIVING ROOM</Text>
            <Text style={styles.deviceTitle}>TCL  TV</Text>
          </View>

          <TouchableOpacity
            style={styles.circleButton}
            activeOpacity={0.6}
            onPress={()=> sendCommand('BACK')}
          >
            <ArrowLeft color={theme.colors.onSurface} size={22} strokeWidth={2}></ArrowLeft>
          </TouchableOpacity>
        </View>


        {/* TRACKPAD ZONE */}
        <View style={styles.trackpadZone}>
        

          {/*toggle pill */}
          <TouchableOpacity
            style={styles.modePill}
            activeOpacity={0.7}
            onPress={()=>setIsSwipeMode(!isSwipeMode)}
          >

          {isSwipeMode? (
            <Move color={theme.colors.onSurfaceVariant} size={14} />
          ) :(
            <MousePointer color={theme.colors.onSurfaceVariant} size={14} />
          )}
          <Text style={styles.modeText}>
              {isSwipeMode? 'SWIPE CONTROLS' : 'TAP CONTROLS'}
          </Text>

          </TouchableOpacity>

          {/* Grid trackpad */}
          {isSwipeMode? (
            //SWIPE MODE SURFACE
            <View
              style={styles.trackpad}
              {...swipeResponder.panHandlers}
            >

              <View style={styles.swipeIndicatorCenter}>
                <Move color={theme.colors.outlineVariant} size={48} opacity={0.15} />
              </View>

            </View>
          ):(

            // TAP MODE GRID
            <TouchableOpacity 
              style={styles.trackpad} 
              activeOpacity={0.9}
              onPress={() => sendCommand('DPAD_CENTER')}
            >
              <View style={styles.gridCrosshairVertical} />
              <View style={styles.gridCrosshairHorizontal} />
              <View style={styles.trackpadGridBounds} />
            </TouchableOpacity>
          )}
        </View>
        
        
        {/* DECK CONTROLS */}
        <View style={styles.deckControlZone}>

            {/* MUTE BUTTON */}
            <TouchableOpacity
              style={styles.muteCircle}
              activeOpacity={0.7}
              onPress={()=> sendCommand('MUTE')}
            >
              <VolumeX color={theme.colors.onSurface} size={22} strokeWidth={2} />
            </TouchableOpacity>


            {/** SLIDER FOR VOLUME */}
            <View style={styles.volumeSliderCapsule}>

              <TouchableOpacity 
                style={styles.sliderTouchTarget}
                onPress={() => {
                    const nextVol = Math.max(0, volume - 5); // Steps down natively by 5 points
                    setVolume(nextVol);
                    sendCommand('VOLUME_DOWN'); 
                  }
                }
              >
                <Minus color={theme.colors.onSurface} size={18} strokeWidth={2.5} />
              </TouchableOpacity>

              <View style={styles.sliderTrackContainer}>
                <View style={styles.sliderTrackBackground}>
                  <View style={[styles.sliderTrackActive, { width: `${volume}%` }]} />
                </View>
              </View>

              <TouchableOpacity
                style={styles.sliderTouchTarget}
                onPress={() => {
                  const nextVol = Math.min(100, volume + 5);
                  setVolume(nextVol);
                  sendCommand('VOLUME_UP'); 
                }}
              >
                <Plus color={theme.colors.onSurface} size={18} strokeWidth={2.5} />
              </TouchableOpacity>

            </View>

            {/*CHANNEL CONTROL*/}
            
        </View>

        
        <View style={styles.bottomSection}>

          {/* BOTTOM NAVIGATION */}

          <View style={styles.bottomNavRow}>
            <TouchableOpacity style={styles.navIconActive}>
              <Pointer color={theme.colors.onSurface} size={22} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navIconInactive}>
              <LayoutDashboard color={theme.colors.onSurfaceVariant} size={22} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navIconInactive}>
              <PlayCircle color={theme.colors.onSurfaceVariant} size={22} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navIconInactive}>
              <Settings2 color={theme.colors.onSurfaceVariant} size={22} />
            </TouchableOpacity>
          </View>

        </View>

        <PairingModal
          visible={isPairingVisible}
          onClose={() => setIsPairingVisible(false)}
          onSubmitPin={handlePairingSubmit}
          isPairingLoading={isPairingLoading}
          tvName="TCL Google TV"
        >

        </PairingModal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeviceListVisible}
          onRequestClose={() => setIsDeviceListVisible(false)}
        >

          <View style={styles.modalOverlay}>
                <View style={styles.deviceListContainer}>
                  <Text style={styles.modalTitle}> Select a TV </Text>

                  {availableTVs.length === 0 ? (
                    <Text style={styles.modalSubtitle}> Searching for devices on your Wi-Fi... </Text>
                  ):(
                    <FlatList
                      data={availableTVs}
                      keyExtractor={(item) => item.ip}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.deviceItem}
                          onPress={() => {
                            setIsDeviceListVisible(false);
                            handleConcectToTv(item);
                          }}
                        >
                          <Tv color="#38BDF8" size={24} />
                          <View style={{ marginLeft: 12 }}>
                            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                            <Text style={{ color: '#94A3B8', fontSize: 13 }}>{item.ip}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                  
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsDeviceListVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                </View>

                
          </View>

        </Modal>



      </SafeAreaView>
    </SafeAreaProvider>
  )
}


export default RemoteScreen;


interface Styles {
  container: ViewStyle;
  headerBar: ViewStyle;
  listIcon: ViewStyle;
  brandText: TextStyle;
  avatarCircle: ViewStyle;
  avatarInnerPill: ViewStyle;
  navZone: ViewStyle;
  circleButton: ViewStyle;
  titleContainer: ViewStyle;
  subLabelCaps: TextStyle;
  deviceTitle: TextStyle;
  trackpadZone: ViewStyle;
  modePill: ViewStyle;
  modeText: TextStyle;
  trackpad: ViewStyle;
  gridCrosshairVertical: ViewStyle;
  gridCrosshairHorizontal: ViewStyle;
  trackpadGridBounds: ViewStyle;
  deckControlZone: ViewStyle;
  muteCircle: ViewStyle;
  volumeSliderCapsule: ViewStyle;
  sliderTrackContainer: ViewStyle;
  sliderTouchTarget: ViewStyle;
  sliderTrackBackground: ViewStyle;
  sliderTrackActive: ViewStyle;
  bottomSection: ViewStyle;
  swipeIndicatorCenter: ViewStyle;
  bottomNavRow: ViewStyle;
  navIconActive: ViewStyle;
  navIconInactive: ViewStyle;
  deviceListContainer: ViewStyle;
  deviceItem: ViewStyle;
  modalOverlay: ViewStyle;
  modalTitle: TextStyle;
  modalSubtitle: TextStyle;
  button: ViewStyle;
  cancelButton: ViewStyle;
  cancelButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between'
  },

  headerBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.base
  },

  listIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  brandText: {
    fontFamily: 'Manrope-Bold',
    color: theme.colors.primary,
    fontSize: 20,
    letterSpacing: -0.5
  },

  headerIcon: {
    marginRight: theme.spacing.base
  },

  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: theme.rounded.full,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'

  },

  avatarInnerPill: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: theme.colors.surfaceBright
  },

  navZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.safeMargin
  },

  circleButton: {
    width: 52,
    height: 52,
    borderRadius: theme.rounded.full,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    alignItems: 'center'
  },

  subLabelCaps: {
    ...theme.typography.labelCaps,
    color: theme.colors.outline,
    marginBottom: 4
  },

  deviceTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.primary,
    fontSize: 24
  },

  trackpadZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.safeMargin,
  },

  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.rounded.full,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    marginBottom: theme.spacing.gutter,
    alignSelf: 'flex-end'
  },

  modeText: {
    ...theme.typography.labelCaps,
    color: theme.colors.onSurface,
    marginLeft: theme.spacing.base,
    fontSize: 11
  },

  trackpad: {
    width: '100%',
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.rounded.xl * 1.5,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceContainerHigh,
    position: 'relative',
    overflow: 'hidden'
  },

  gridCrosshairVertical: {
    position: 'absolute',
    left: '50%',
    height: '100%',
    width: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.25
  },

  gridCrosshairHorizontal: {
    position: 'absolute',
    top: '50%',
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.25
  },

  trackpadGridBounds: {
    flex: 1,
    borderWidth: 12,
    borderColor: 'transparent'
  },

  deckControlZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  muteCircle: {
    width: 54,
    height: 54,
    borderRadius: theme.rounded.full,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  volumeSliderCapsule: {
    flex: 1,
    height: 54,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.rounded.full,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  sliderTouchTarget: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },

  sliderTrackContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center', // Centers the thin track line vertically
    marginHorizontal: 4,
  },
  sliderTrackBackground: {
    height: 6,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.rounded.full,
    position: 'relative',
    overflow: 'hidden',
  },

  sliderTrackActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.rounded.full,
  },

  swipeIndicatorCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSection: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderTopLeftRadius: theme.rounded.xl * 1.2,
    borderTopRightRadius: theme.rounded.xl * 1.2,
    paddingTop: theme.spacing.safeMargin,
    paddingBottom: theme.spacing.safeMargin,
    marginHorizontal: -theme.spacing.safeMargin * 1.4, // Pulls it out to the edge of the screen
    marginTop: theme.spacing.base * 2,
    marginBottom: -theme.spacing.safeMargin * 1.4,
  },

  bottomNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  navIconActive: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconInactive: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deviceListContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#161B26',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#232A3B',
    maxHeight: '70%',
  },

  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F131C',
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2E384D',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 23, 0.85)', // Matches dark theme overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFF',
      marginBottom: 8,
  },

  modalSubtitle: {
      fontSize: 14,
      color: '#94A3B8',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
  },

  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 15,
  },
})