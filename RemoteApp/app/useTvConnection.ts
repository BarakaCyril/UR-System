import { useState } from "react";

const SERVER_URL = 'http://192.168.100.199:3000';

export type TVCommand = 
| 'POWER' 
| 'VOLUME_UP'
| 'VOLUME_DOWN'
| 'MUTE'
| 'HOME'
| 'BACK'
| 'DPAD_UP'
| 'DPAD_DOWN'
| 'DPAD_LEFT' 
| 'DPAD_RIGHT' 
| 'DPAD_CENTER'
| 'LAUNCH_YOUTUBE'
| 'LAUNCH_NETFLIX'
| 'SETTINGS';

export function useTVConnection() {
    const [isSending, setIsSending] = useState(false);
    const [lastError, setLastError] = useState<string | null> (null);


    const sendCommand = async (command: TVCommand) => {
        setIsSending(true);
        setLastError(null);

        try {
            const response = await fetch(`${SERVER_URL}/command`, {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify({
                    action: 'BUTTON_PRESS',
                    command: command
                })
            });

            if (!response.ok){
                throw new Error (`Server responded with a status: ${response.status}`);
            }

            console.log(`Successfully sent command: ${command}`);
        }catch(error){
            console.error(`Failed to send command ${command}: `, error);
            setLastError(error instanceof Error? error.message : 'Unkown network error');
        } finally {
            setIsSending(false)
        }
    };

    return {
        sendCommand,
        isSending,
        lastError,
    };
    
}

export default useTVConnection;