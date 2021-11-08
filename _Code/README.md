## Setup instructions for CandyBot 2.0 on Raspberry Pi Zero W
- Using Raspbian Lite
- Headless with Ethernet via USB OTG Adapter
- Accessing SSH via Putty / WinSCP

#### At SSH Terminal:  
sudo apt-get update  
sudo apt-get upgrade  

#### Install NodeJS and NPM:  
sudo apt-get install -y nodejs  
sudo apt-get install -y npm  

#### Make directory for files:  
mkdir CandyBot2  
cd CandyBot2/  

#### Install Node Packages:  
npm install onoff
npm install rpi-ws281x
npm install socket.io
npm install bufferutil
npm install utf-8-validate


#### Move Files to Raspberry Pi
Using WinSCP copy all files in _Code folder to CandyBot2/ directory


#### Run Server
sudo node serverMain.js
