import { useRef, useState } from "react";
import { StyleSheet, View, Modal, TextInput, TouchableOpacity, ActivityIndicator, Text } from "react-native";

interface PairingModalProps {
    visible: boolean;
    onClose: ()=> void;
    onSubmitPin: (pin: string) => void;
    isPairingLoading: boolean;
    tvName?: string;
}

export const PairingModal: React.FC<PairingModalProps> = ({
    visible,
    onClose,
    onSubmitPin,
    isPairingLoading,
    tvName = 'TCL Google TV'
}) => {
    const [pin, setPin] = useState('');
    const inputRef = useRef<TextInput>(null);

    const handleTextChange = (text: string) => {
        //Only allow number sand limit to 6 digits
        const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6)
        setPin(cleaned);
    } 

    const handleSubmit = ()=> {
        if (pin.length === 6) onSubmitPin(pin);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Pairing Required</Text>
                    <Text style={styles.modalSubtitle}>
                            Please enter the 6-digit PIN code displayed on your {tvName}.
                    </Text>

                    {/* Hidden text input that focuses the keyboard */}
                    <TextInput
                        ref={inputRef}
                        style={styles.hiddenInput}
                        value={pin}
                        onChangeText={handleTextChange}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus={true}
                    />

                     {/*Visual grid for the 6-pin slots */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => inputRef.current?.focus()} 
                        style={styles.pinContainer}
                     >
                        {Array.from({length: 6}).map((_, index) => {
                            const digit = pin[index];
                            const isFocused = pin.length === index;
                            return (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.pinBox, 
                                        isFocused && styles.pinBoxFocused,
                                        digit !== undefined && styles.pinBoxFilled
                                    ]}
                                    >
                                    <Text style={styles.pinText}>{digit || ''}</Text>
                                </View>
                            );
                        })}
                    </TouchableOpacity>

                     {/*Action row */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={isPairingLoading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button, 
                                styles.submitButton, 
                                pin.length !== 6 && styles.submitButtonDisabled
                            ]} 
                            onPress={handleSubmit}
                            disabled={pin.length !== 6 || isPairingLoading}
                        >
                            {isPairingLoading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Verify PIN</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(10, 14, 23, 0.85)', // Matches dark theme overlay
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#161B26', // Dark background matching your remote UI
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#232A3B',
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
    hiddenInput: {
        position: 'absolute',
        width: 0,
        height: 0,
        opacity: 0,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    pinBox: {
        width: 42,
        height: 52,
        borderWidth: 1.5,
        borderColor: '#2E384D',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F131C',
    },
    pinBoxFocused: {
        borderColor: '#38BDF8', // Highlight color when typing
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    pinBoxFilled: {
        borderColor: '#64748B',
    },
    pinText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
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
    submitButton: {
        backgroundColor: '#38BDF8',
    },
    submitButtonDisabled: {
        backgroundColor: '#1E293B',
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#0F131C',
        fontWeight: '700',
        fontSize: 15,
    },
})