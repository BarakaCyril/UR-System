import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Power, Plus, Minus, ArrowLeft, ChevronDown, Tv, Wifi, Settings, Home, Play } from 'lucide-react-native';


//define a funtional component
const RemoteScreen: React.FC = ()=> {
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>


                {/*  HEADER SECTION */}
                <View style={styles.headerZone}>
                    <Text style={styles.logoText}> Grande Controller</Text>
                    <View style={styles.tvSelector}>
                        <Tv color="#aaaaaa" size={18}/>
                        <ChevronDown color="#aaaaaa" style={styles.dropdownArrow}/>
                    </View>
                </View>

                {/*UPPER CONTROL */}
                <View style={styles.controlsZone}>

                    <TouchableOpacity style={styles.powerButtonCircle} activeOpacity={0.7}>
                        <Power color="#ff4444" size={22} strokeWidth={2.5} />
                    </TouchableOpacity>

                    {/**VOLUME, HOME AND BACK*/}
                    <View style={styles.pillsRow}>

                        <View style={styles.verticalPill}>
                            <TouchableOpacity style={styles.pillButton}><Plus color="#888888" size={20} /></TouchableOpacity>
                            <Text style={styles.pillLabel}>Vol</Text>
                            <TouchableOpacity style={styles.pillButton}><Minus color="#888888" size={20} /></TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.homeOuterRing} activeOpacity={0.7}>
                            <Home color="#a855f7" size={20} strokeWidth={2} />
                        </TouchableOpacity>

                        {/* Back Pill */}
                        <View style={styles.verticalPill}>
                            <View style={styles.pillSpacer} />
                                <TouchableOpacity style={styles.pillButton} activeOpacity={0.6}>
                                    <ArrowLeft color="#888888" size={22} strokeWidth={2.5} />
                                    <Text style={styles.backLabel}>Back</Text>
                                </TouchableOpacity>
                            <View style={styles.pillSpacer} />
                        </View>
                    </View>
                </View>



                {/*TRACKPAD ZONE */}

                <View style={styles.trackpadZone}>
                    <View style={styles.trackpadWrapper}>
                        {/* Left Wing: YouTube */}
                        <TouchableOpacity style={[styles.streamingButton, styles.youtubeColor]} activeOpacity={0.7}>
                            <Play color="#e509148b" size={14} fill="#e50914a4'" />
                            
                        </TouchableOpacity>

                        {/* Central Trackpad */}
                        <TouchableOpacity style={styles.largeTrackpadOuter} activeOpacity={0.9}>
                            <View style={styles.largeTrackpadInner} />
                        </TouchableOpacity>


                        {/* Right Wing: Netflix */}
                        <TouchableOpacity style={[styles.streamingButton, styles.netflixColor]} activeOpacity={0.7}>
                            <Text style={[styles.streamingText, { fontWeight: '900', color: '#e50914a4' }]}>N</Text>
                        </TouchableOpacity>

                        
                    </View>
                </View>

                {/* ZONE 4: FOOTER */}
                <View style={styles.footerZone}>
                    <TouchableOpacity><Wifi color="#555555" size={22} /></TouchableOpacity>
                    <TouchableOpacity><Settings color="#555555" size={22} /></TouchableOpacity>
                </View>
                

            </SafeAreaView>
        </SafeAreaProvider>
    )
}


export default RemoteScreen

interface Styles {
  container: ViewStyle;
  headerZone: ViewStyle;
  logoText: TextStyle;
  tvSelector: ViewStyle;
  tvSelectorText: TextStyle;
  dropdownArrow: ViewStyle;
  controlsZone: ViewStyle;
  powerButtonCircle: ViewStyle;
  pillsRow: ViewStyle;
  verticalPill: ViewStyle;
  pillButton: ViewStyle;
  pillLabel: TextStyle;
  backLabel: TextStyle;
  pillSpacer: ViewStyle;
  homeOuterRing: ViewStyle;
  trackpadZone: ViewStyle;
  trackpadWrapper: ViewStyle;
  largeTrackpadOuter: ViewStyle;
  largeTrackpadInner: ViewStyle;
  streamingButton: ViewStyle;
  youtubeColor: ViewStyle;
  netflixColor: ViewStyle;
  streamingText: TextStyle;
  footerZone: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 24,
  },
  headerZone: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  tvSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tvSelectorText: {
    color: '#aaaaaa',
    marginLeft: 4,
    fontSize: 14,
  },
  dropdownArrow: {
    marginLeft: 4,
  },
  controlsZone: {
    flex: 2.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerButtonCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  verticalPill: {
    width: 62,
    height: 185,
    borderRadius: 30,
    backgroundColor: '#141414',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pillButton: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillLabel: {
    color: '#555555',
    fontWeight: '600',
    fontSize: 13,
  },
  backLabel: {
    color: '#555555',
    fontWeight: '600',
    fontSize: 11,
    marginTop: 2,
  },
  pillSpacer: {
    height: 10,
  },
  homeOuterRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#3b2063', // Neon purple hint from design image
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  trackpadZone: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackpadWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  largeTrackpadOuter: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: '#251a3a', // Base ring accent
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeTrackpadInner: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: '#121212',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  streamingButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  youtubeColor: {
    borderWidth: 1,
    borderColor: '#ff000033', // Subtle red rim
  },
  netflixColor: {
    borderWidth: 1,
    borderColor: '#e5091433', // Subtle dark red rim
  },
  streamingText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  footerZone: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});