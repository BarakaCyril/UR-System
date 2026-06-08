
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/ping', (req, res) => {
    console.log("Phone pinged laptop server");
    res.send("Hello from my laptop server!");
});


app.listen(PORT, '0.0.0.0', ()=> {
    console.log(`Server is running on port ${PORT}`);
})