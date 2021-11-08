# CandyBot 2
### An touchscreen interactive, candy dispensing kiosk built for Trick-or-Treating during 2021.

![Image of CandyBot 2 - Front](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_FrontOverview.JPG)

### Status: Functional

### General Usage and Features Video: https://youtu.be/N4MPaL-Y3Hs
### Technical Overview Video:

## Overview
This is the evolution of [Candy Bot](https://github.com/wrcsubers/RasPi_CandyBot) which I built in 2020 during the COVID-19 Pandemic.  With COVID fears lessening and assuredly more trick-or-treaters, I decided to make a more interactive Candy Bot.  Additionally, I had acquired a 22" Kiosk Touchscreen which I wanted to integrate.  I originally played with making something of a slot-machine, but I wasn't happy with the direction the project was going so I decided on a Pick and Match 3 game.  I was ultimately very happy with the way the project turned out, however, once in use, I realized a problem.  The game was too complicated for most of the Trick-Or-Treaters to quickly grasp and took too long per user to play.  This was also compounded by using a low-powered laptop which had trouble encoding the video streams and displaying the kiosk content in a seamless manner.  I've already got some ideas for next year's Candy Bot growing in my head.  If you have any questions or comments, feel free to start a discussion or open an issue if needed.  Thanks for checking this project out =)

## The Kiosk

The Kiosk is what the Trick-Or-Treaters interact with and contains everything needed for Candy Bot 2 to work.  Candy Bot 2 doesn't *need* a management client to work (unlike the original Candy Bot), but one is recommended, especially to manually feed candy when there is a jam or miss-feed.

#### Hardware

![Image of CandyBot 2 - Rear Detail](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_RearDetail.JPG)

* Raspberry Pi Zero W:
  * Webserver for Kiosk and Control Station HTML/CSS/JS Files
  * Signalling Server for WebRTC
  * Kiosk Signalling and Control 
  * Stepper Controller
    * Pulse GPIO pins for motor steps
    * Control Direction holding pins high or low
  * RGB Lighting Controller (rpi-ws281x-nodejs)
  * USB OTG Ethernet Adapter
* 22" LCD Touchscreen
* HP Laptop
  * Runs webpage on Kiosk Screen using Firefox Enterprise in Kiosk Mode
  * Encodes Audio/Video from Webcam/Microphone
    * 1x Arducam IMX291 Ultra Wide Angle Webcam with Microphone 
* Custom Built Candy Dispenser
  * 2x StepperOnline 17HS19-2004S1 84 Oz.in NEMA 17 Stepper Motors
  * 2x StepperOnline DM542T Stepper Drivers
  * My wife sewed a conveyor belt and then added hot-glue strips for better candy grippage
* RGB Lighting (2 x 43 LED Strips running in parallel)
  * Custom lighting modes
    * 'Flame' for normal operation, randomly fades each LED between red, orange, yellow
    * Selectable colors for interactivity
* Solderless Breadboard
  * Logic Level Shifter 3.3V > 5V for RGB Lighting Strip
  * Connections for Stepper Drivers, Grounds between PSUs, etc
* Flex-ATX Power Supply
  * Provides 12V power to Touchscreen
  * Provides 5V power to RGB Lighting
* 24V Power Supply
  * Provides power to steppers drivers/motors
* USB Wall Charger
  * Supplies power to RaspberryPi Zero W


#### Software

The kiosk software can be split into a two different parts.  
  
First, running on the Raspberry Pi, is a NodeJS server running the [serverMain.js script](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/serverMain.js).  This script handles the communication between the kiosk and management terminal and also the control of the candy feeder and RGB lights.  This messaging relies on [Socket.IO](https://socket.io/) and messages can be sent directly to the Raspberry Pi from the kiosk or managment terminal (feeding candy/changing lights), from management client -> kiosk (resetting game/custom messages) or from client -> management client (connection status/video feed negotiation).  The NodeJS server also runs a webserver which contains all the HTML, CSS, Javascript and Artwork files.  
  
Secondly, the kiosk pc is a laptop running Windows 10.  Firefox Enterprise is running the Client Page in 'Kiosk Mode' which helps lockdown the user experience.  'Kiosk Mode' forces the browser into full-screen, disables right-click menus and hides all menu/tool/status bars.  One of the issues I had was with the windows sidebar showing up on the touchscreen, which I remedied by killing 'explorer.exe' through task manager.  I also have TightVNC Server running which makes management easier.

#### Gameplay

* The winning prize is determined prior to the start of play by a function which can be modified to change the chance of getting specific prizes ([getRandomPrize()](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L135)).  
* This winning prize is assigned to the first 3 items in an array, then that array is filled with a random number of additional non-winning prizes, no more than 2 of each ([GeneratePrize()](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L227)).
* Actual play begins at the main screen and then gameplay flows to various screens depending on what is awarded to each player.  
* Users select one icon at a time from a grid of 12 non-similar, randomly selected icons ([GenerateIcons()](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L154)).  
![Candy Bot 2 - Main Screen Icons Unpicked](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotIconsNormal.png)
* When an icon is selected a random item from the 'prizeArray' is selected and then displayed to the user, revealing either 'Treat', 'Double Treat' or 'Trick + Treat'.  This random selection (along with the random prizes in and length of array) means that each prize in the array will not neccessarily be shown.  This mechanic helps the game feel more random to players.  
![Candy Bot 2 - Main Screen Icons Picked](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotIconsPicked.png)
* Each selection increments a counter for the type of prize.  If a prize counter equals 3, then another function is triggered either [awardTreat()](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L443) or [awardTrick()](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L397).
  * The awardTreat() function simply displays the text showing how much candy was won and then directs the user to place their candy bag below the chute and press the button on the screen to dispense the candy.  Additionally, this function tells the Raspberry Pi to flash the chute lights green which helps direct the user to place thier bag.  An 'Auto-Dispense' timer is started and will feed candy automatically when it times-out.  The amount of candy to be dispensed is sent as a positive or negative value of -2 or -1 for reverse or 1 or 2 for forward movements.  These values correlate to the number of steps the motors turn which is set in the [serverMain.js script](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/serverMain.js#L261).  
  ![Candy Bot 2 - Screenshot Double Treat](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotTreat.png) ![Candy Bot 2 - Screenshot Treat](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotDoubleTreat.png) 
  * The awardTrick() function shows a screen directing the user to press a 'Crystal Ball'.  Wether a joke or light show is determined by a random number selection between 1-100 with a likelihood modifier determined [here](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L402).  The default setting means a joke is displayed 40% of the time, with a light show the other 60%.  
  ![Candy Bot 2 - Screenshot Trick and Treat](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotTrickAndTreat.png)
  * If a joke is chosen the [tellJoke() function](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L474) is ran and a joke is shown from the [jokes_array](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L60) which increments after each joke.  The setup is shown, and then the punchline is shown.  Afterwards the user is awarded their Treat.  
  ![Candy Bot 2 - Trick Joke Setup](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotTrickJoke1.png) ![Candy Bot 2 - Trick Joke Punchline](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotTrickJoke2.png)
  * If a light show is chosen the [pickLights() function](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L521) is ran and a grid of colored potion bottles is shown to the user.  Upon selection, a command is sent to the Raspberry Pi to change the light show to match the chosen potion bottle.  The user gets 4 selections and the light show times-out after 15 seconds  Afterwards the user is awarded their Treat.  
  ![Candy Bot 2 - Trick Light Show Screenshot](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotTrickLight.png) ![Candy Bot 2 - Trick Light Show Rainbow](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_FrontColorRainbow.JPG)
* After each user is awarded their treat, the [endPlay() function](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L617) is ran which turns off the chute lights and displays 'Happy Halloween' on the screen.  Another timer is started and once it times-out, the [resetGame() function](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L642) is ran, which readies the kiosk for another play.  
![Candy Bot 2 - End Play Screen](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotEndPlay.png)


#### Other Features

* The kiosk can also display custom messages which are sent from the management client.  These messages will interupt all gameplay but will NOT interupt timers or other processes.  
![Candy Bot 2 - Message Display Screen](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_FrontMessage.JPG)
* The kiosk has a managment menu which was mostly used during development for testing purposes.  I have noticed some buggy behavior when using some of the funtions on this screen, so use with caution.  Similar to displaying messages, the mangement menu will interupt all gameplay but will NOT interupt timers or other processes.  
* This menu can be access by double tapping on the lower right-hand side of the screen.  This prompts the user for a passcode which is set [here](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Code/www/scripts/clientMain.js#L3).  If the passcode is incorrect, the prompt simply disappears.  If enterted correctly, the managment menu is displayed.  
![Candy Bot 2 - Screenshot Managment Menu](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotManagementMenu.png)
  * The first 4 buttons let you manually control the feeder, moving it backward or forward.
  * The 'Reset Game' button resets the current game.
  * The 'Reload Client' button reloads the whole page and starts everything over.
  * Below the reset game button, the current prize array is shown.
  * Next you can force the display to show either a joke or a light show trick after exiting the management menu
  * Lastly, the 'Start Screen Share' button is used when starting the kiosk to begin sending the screen's display to the management client.
  * Use the 'Exit' button to return to the main screen.


## Management Client

#### Hardware
The managment client can be ran on any laptop/desktop, although it should have a wired network connection.

#### Software
Management client was running Windows 10 Pro (any OS should work) and Firefox 94.0.

#### Usage
* The management client consists of a single HTML page with a number of features which help support the kiosk.  
![Candy Bot 2 - Screenshot Managment Client](https://github.com/wrcsubers/RasPi_CandyBot2/blob/main/_Images/CandyBot2_ScreenshotManagementClient.png)
* Top Section of page
  * One red/green circle indicating wether or not this manamgement client is connected to the Raspberry Pi Node.js server and the other red/green circle indicating if the kiosk is connected to the Node.js server.
  * The 'Start Stream' button negotiates webcam streaming from the kiosk to this managment client.
  * The 'Reload Client' button forces the kiosk to reload the page being display, which will reset everything on the client.
* Middle Section of page
  * Left video placeholder - This is where the kiosk front webcam video will appear.
  * Right video placeholder - This is where the screen share of the kiosk will appear.
* Lower Secton of page
  * Large buttons allowing manual triggering of the candy feeder both backwards and forwards
  * 'Reset Game' button forces the game to be reset on the kiosk.
  * Custom Message Area
    *  Type any message into the message box, press 'enter' to send.
    *  Timeout allows the time the message is displayed on the kiosk to vary.
    *  Show QR Code - shows the predefined QR Code message on the kioks.  QR Code image is stored at www/images/other folder on Raspberry Pi.
    *  Close message box - closes the message box on the kiosk now, regardless of timeout.
  * Light Shows - Click on a color to force the kiosk to change to that color - Kiosk will override this when modes change.  

## Notes
* This enite system *could* be run over WiFi, but works best when hardwired.
* Firefox browser was used on the Kiosk and Control Station.
* I used candy which was consistent in size  as differing sizes caused unreliable feeding and jamming.
* Due to limitations with WebRTC, in order to stream the desktop of the Kiosk display you must enable it by clicking a button on the display page.  I accomplished this by using VNC to remote into the kiosk and starting the stream.  Once enabled everything can be controlled from the control station.
* Kiosk/Control Station must use HTTPS due to WebRTC, certificates are included.  
* The code is a little rough around the edges, but the functionality is 100%.  Some of the code is unused and some is not complete as I ran out of time at the end of the project.  Getting WebRTC to stream audio/video was difficult for me to implement and is likely messier than it needs to be.
*  Unfortunately, after watching a bunch of people use the kiosk it seems like everything is just too complicated.  Play times are quite long and next time I'll likely do something simpler and more streamlined.
