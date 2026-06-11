
const express = require('express');
const {exec} = require('child_process');
const app = express();
const cors = require('cors');
const PORT = 3000;

const adbKeycodes = {
  'POWER': '26',
  'VOLUME_UP': '24',
  'VOLUME_DOWN': '25',
  'HOME': '3',
  'BACK': '4',
  'DPAD_CENTER': '66',
  'DPAD_UP': '19',
  'DPAD_DOWN': '20',
  'DPAD_LEFT': '21',
  'DPAD_RIGHT': '22',
  'MUTE': '91',
};



app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
    console.log("Phone pinged laptop server");
    res.send("Hello from my laptop server!");
});

app.post('/command', (req, res) => {
    const {action, command} = req.body;

    if (adbKeycodes[command]){
        const keycode = adbKeycodes[command]
    
        // Execute the wireless ADB command directly to the Android TV system core
        exec(`adb shell input keyevent ${keycode}`, (err) => {
            if (err){
                console.error(`ADB FEEEILYA for command ${command}:`, err);
                return res.status(500).json({ error: 'Failed to communicate with TV' });
            }

            console.log(` TV Executed Keyevent: ${command} (Keycode: ${keycode})`)
            return res.status(200).json({
                success: true
            });
        })
    
    }else if (command === 'LAUNCH_YOUTUBE'){

        exec(`adb shell am start -a android.intent.action.VIEW -d "https://www.youtube.com"`, (err) => {
            if (!err) console.log('TV Launched YouTube app');
        });
        res.status(200).json({ success: true });

    }else if (command === 'LAUNCH_NETFLIX'){

        exec(`adb shell am start -n com.netflix.ninja/.MainActivity`, (err) => {
            if (!err) console.log('TV Launched Netflix app');
        });
        res.status(200).json({ success: true });
    }else{
        console.log(`⚠️ Unmapped command received: ${command}`);
        res.status(400).json({ error: 'Unknown command structure' });
    }

});

app.get('/volume', (req, res) => {
  exec('adb shell settings get system volume_music', (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read TV volume state' });
    }
    const currentVolume = parseInt(stdout.trim(), 10) || 0;
    return res.status(200).json({ level: currentVolume });
  });
});
