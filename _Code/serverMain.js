// Last used on the following setup:
//
// Hardware:
//		RaspberryPi Zero W
//      WS2812B LED Strips - 86 LEDs, running 2x 43 in parallel
//      2x TB6600 Stepper Motor Controllers @ 24V
//      2x NEMA17 84oz/in Stepper Motors
//      Logic Level Shifter
// 
// Software:
//      Node.js v10.22.1
//		onoff v6.0.0 - https://www.npmjs.com/package/onoff
//		rpi-ws281x v1.0.34 - https://www.npmjs.com/package/rpi-ws281x
//		socket.io v2.3.0- https://socket.io/
// 

console.clear();

// Setup Webserver Dependecies
//========================================================================
var path = require('path');
var fs = require('fs');
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '/www/certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/www/certs/cert.pem'))
};
var https = require('https').createServer(httpsOptions, httpServer);

// Setup Dependecies
//========================================================================
var io = require('socket.io')(https);
const Gpio = require('onoff').Gpio;
var ws281x = require('rpi-ws281x');
const { Socket } = require('socket.io');



// RGB Lighting Stuff
//========================================================================

// Setup Variables
const numLEDs = 43;
var ledLightShowName = 'Default';
var lightCandyChute = false;
var candyChuteBlinker = 0;

// Create initial colors for default show (Flames)
var colorGreen = new Array(numLEDs);
var colorPosNeg = new Array(numLEDs);
var pixels = new Uint32Array(numLEDs);

for (var i = 0; i < numLEDs; i++) {
    colorGreen[i] = Math.floor(Math.random() * Math.floor(255));
    colorPosNeg[i] = Math.floor(Math.random() * Math.floor(2));
}


class LEDLightShow {
    constructor() {
        this.config = {};
        // Number of leds
        this.config.leds = numLEDs;
        // Use DMA 10
        this.config.dma = 10;
        // Set brightness, 0 to 255
        this.config.brightness = 255;
        // GPIO Number
        this.config.gpio = 18;
        // The RGB sequence (rgb, grb, etc)
        this.config.stripType = 'grb';
        // Configure ws281x
        ws281x.configure(this.config);
    }

    run() {
        if (ledLightShowName == 'Default') {
            // Normal Mode (Flames) - Continuously varies the current color to give dynamic lighting
            for (var i = 0; i < this.config.leds; i++) {
                let change = Math.floor((Math.random() * Math.floor(5)) + 5);
                if (colorGreen[i] <= 10) {
                    colorPosNeg[i] = 1;
                }
                if (colorGreen[i] >= 245) {
                    colorPosNeg[i] = 0;
                }
                if (colorPosNeg[i] == 0) {
                    colorGreen[i] = colorGreen[i] - change;
                } else {
                    colorGreen[i] = colorGreen[i] + change;
                }
                var red = 255,
                    green = colorGreen[i],
                    blue = 0
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Rainbow Show
        } else if (ledLightShowName == 'Rainbow') {
            for (var i = 0; i < this.config.leds; i++) {
                if (i > 36) {
                    var red = 128,
                        green = 0,
                        blue = 128
                } else if (i > 29) {
                    var red = 0,
                        green = 255,
                        blue = 0
                } else if (i > 22) {
                    var red = 0,
                        green = 0,
                        blue = 255
                } else if (i > 15) {
                    var red = 255,
                        green = 255,
                        blue = 0
                } else if (i > 7) {
                    var red = 255,
                        green = 165,
                        blue = 0
                } else if (i >= 0) {
                    var red = 255,
                        green = 0,
                        blue = 0
                }
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Red Show
        } else if (ledLightShowName == 'Red') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 255,
                    green = 0,
                    blue = 0
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Green Show
        } else if (ledLightShowName == 'Green') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 0,
                    green = 255,
                    blue = 0
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Blue Show
        } else if (ledLightShowName == 'Blue') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 0,
                    green = 0,
                    blue = 255
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Purple Show
        } else if (ledLightShowName == 'Purple') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 128,
                    green = 0,
                    blue = 128
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Pink Show
        } else if (ledLightShowName == 'Pink') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 255,
                    green = 105,
                    blue = 180
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Yellow Show
        } else if (ledLightShowName == 'Yellow') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 255,
                    green = 255,
                    blue = 0
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Orange Show
        } else if (ledLightShowName == 'Orange') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 255,
                    green = 165,
                    blue = 0
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Turquoise Show
        } else if (ledLightShowName == 'Turquoise') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 64,
                    green = 224,
                    blue = 208
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // White Show
        } else if (ledLightShowName == 'White') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 255,
                    green = 255,
                    blue = 255
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
            // Lights Off
        } else if (ledLightShowName == 'Black') {
            for (var i = 0; i < this.config.leds; i++) {
                var red = 0,
                    green = 0,
                    blue = 0
                var color = (red << 16) | (green << 8) | blue;
                pixels[i] = color;
            }
        }
        // Light Candy Chute Up
        if (lightCandyChute == true) {
            if (candyChuteBlinker < 3) {
                for (var i = (this.config.leds - 3); i < this.config.leds; i++) {
                    var red = 0,
                        green = 255,
                        blue = 0
                    var color = (red << 16) | (green << 8) | blue;
                    pixels[i] = color;
                }
                candyChuteBlinker++;
            } else if (candyChuteBlinker < 6) {
                for (var i = (this.config.leds - 3); i < this.config.leds; i++) {
                    var red = 0,
                        green = 0,
                        blue = 0
                    var color = (red << 16) | (green << 8) | blue;
                    pixels[i] = color;
                };
                candyChuteBlinker++
                if (candyChuteBlinker == 6) {
                    candyChuteBlinker = 0;
                }
            }
        }
        // Render to strip
        ws281x.render(pixels);
    }
};

var myLEDLightShow = new LEDLightShow();

setInterval(() => {
    myLEDLightShow.run()
}, 200);

// Setup Variables
//================================================================================
const stepperDirection_1 = new Gpio(2, 'out');
const stepperDirection_2 = new Gpio(3, 'out');
const stepperPulse = new Gpio(4, 'out');

// Define number of steps per trigger
const steps_Neg_2 = -250;
const steps_Neg_1 = -125;
const steps_Pos_1 = 125;
const steps_Pos_2 = 250;
var stepperRunning = false;

var candybotClientConnected = false;
var candybotClientIP = null;
var candybotManagerConnected = false;
var candybotManagerIP = null;

var remoteVideoLink = null;
var remoteScreenLink = null;
var displayMessage = null;


// Setup Web Server
//================================================================================
var dir = path.join(__dirname, '/www');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

function httpServer(httpRequest, httpResponse) {
    var httpRequestPath = httpRequest.url.toString().split('?')[0];
    var file = null;
    if (httpRequestPath == '/') {
        file = path.join(dir, '/index.html');
    } else {
        file = path.join(dir, httpRequest.url.toString());
    }

    if (file.indexOf(dir + path.sep) !== 0) {
        httpResponse.statusCode = 403;
        httpResponse.setHeader('Content-Type', 'text/plain');
        return httpResponse.end('Forbidden');
    }

    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var readFile = fs.createReadStream(file);

    readFile.on('open', function() {
        httpResponse.setHeader('Content-Type', type);
        readFile.pipe(httpResponse);
    });

    readFile.on('error', function() {
        httpResponse.setHeader('Content-Type', 'text/plain');
        httpResponse.statusCode = 404;
        httpResponse.end('Not found');
    });
};

https.listen(443, function() {
    console.log('Webserver Started! Listening on Port 443 for Connections...');
});



// Socket.IO Messaging
//================================================================================
io.on('connection', (socket) => {

    // Client Connection
    socket.on('clientConnected', (data) => {
        candybotClientConnected = data;
        candybotClientIP = (((socket.handshake.address).split(':')).pop());
        console.log('Client Connected @ ' + (((socket.handshake.address).split(':')).pop()));
        updateConnectionStatus();
    });

    // Manager Connection
    socket.on('managerConnected', (data) => {
        candybotManagerConnected = data;
        candybotManagerIP = (((socket.handshake.address).split(':')).pop());
        console.log('Manager Connected @ ' + (((socket.handshake.address).split(':')).pop()));
        updateConnectionStatus();
    });

    // Client/Manager Disconnect
    socket.on('disconnect', (reason) => {
        if ((((socket.handshake.address).split(':')).pop()) == candybotClientIP) {
            candybotClientConnected = false;
            candybotClientIP = null;
            console.log('Client @ ' + (((socket.handshake.address).split(':')).pop()) + ' was disconnected due to a ' + reason);
        } else if ((((socket.handshake.address).split(':')).pop()) == candybotManagerIP) {
            candybotManagerConnected = false;
            candybotManagerIP = null;
            console.log('Manager @ ' + (((socket.handshake.address).split(':')).pop()) + ' was disconnected due to a ' + reason);
        } else {
            console.log('Machine @ ' + (((socket.handshake.address).split(':')).pop()) + ' was disconnected due to a ' + reason);
        }
        updateConnectionStatus();
    });

    // Client Video Offer Message
    socket.on('messageToClient', (data) => {
        console.log('Manager > Client Message: ' + data.type + " - " + data.data);
        io.emit('messageFromManager', data);
    });

    // Control Station Video Offer
    socket.on('messageToManager', (data) => {
        console.log('Client > Manager Message: ' + data.type + " - " + data.data);
        io.emit('messageFromClient', data);
    });

    // Run Feeder
    socket.on('runFeeder', (data) => {
        runFeeder(data);
    })

    // Client Change Light Show
    socket.on('changeLightShow', (data) => {
        console.log("Client Changing Light Show to: " + data);
        ledLightShowName = data;
    })

    // Manager Change Light Show
    socket.on('overrideLightShow', (data) => {
        console.log("Manager Changing Light Show to: " + data);
        ledLightShowName = data;
    })

    // Light Up Candy Chute
    socket.on('lightCandyChute', (data) => {
        lightCandyChute = data;
    })
});



// Send Connection Status
//================================================================================
function updateConnectionStatus() {
    data = [
        candybotClientConnected,
        candybotManagerConnected
    ]
    io.emit("connectionStatus", data);
}



// Run Feeder Function
//================================================================================
async function runFeeder(commandAmount) {
    //Convert command to actual steps
    if (commandAmount == -2){
        feedAmount = steps_Neg_2;
    } else if (commandAmount == -1){
        feedAmount = steps_Neg_1;
    } else if (commandAmount == 1){
        feedAmount = steps_Pos_1;
    } else if (commandAmount == 2){
        feedAmount = steps_Pos_2;
    } else {
        feedAmount = 0;
    }
    
    // Run Stepper
    if (stepperRunning == true) {
        console.log('   - Feeder already running... please wait');
    } else {
        console.log('Feeding: ' + feedAmount + ' Steps');
        stepperRunning = true;
        if (feedAmount > 0){
            //Run Forward
            stepperDirection_1.writeSync(0);
            stepperDirection_2.writeSync(1);
		    await sleep(100);
            for (let index = 0; index < feedAmount; index++) {
                stepperPulse.writeSync(1);
                await sleep(1);
                stepperPulse.writeSync(0);
                await sleep(1);
            }
            await sleep(100);
        } else {
            //Run Backward
            stepperDirection_1.writeSync(1);
            stepperDirection_2.writeSync(0);
		    await sleep(100);
            for (let index = 0; index > feedAmount; index--) {
                stepperPulse.writeSync(1);
                await sleep(1);
                stepperPulse.writeSync(0);
                await sleep(1);
            }
            await sleep(100);
        }

        stepperRunning = false;
        console.log('   - Feed Complete')
    }
}



// Sleep Function
//================================================================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



// On Program Exit or Ctrl + C
//================================================================================
process.on('SIGINT', function() {
    process.exit();
});