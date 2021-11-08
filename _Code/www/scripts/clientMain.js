// Variables
//==================================================================================================
const utilitiesPasscode = '89410';
var inputPasscode = '';

// Prize Stuff
//--------------------------------------------------------------------------------------------------
var prizeArray = new Array();
var prize_1xTreat = 0;
var prize_2xTreat = 0;
var prize_TrickAndTreat = 0;

// Light Stuff
//--------------------------------------------------------------------------------------------------
const lightPicksRemainingConst = 4; // Amount of chances to change lights at selection screen
var lightPicksRemaining = null; // Leave null

// Get Selection Row Elements
//--------------------------------------------------------------------------------------------------
var selectionIcons_Row1 = document.getElementById("selectionIcons_Row1");
var selectionIcons_Row2 = document.getElementById("selectionIcons_Row2");
var selectionIcons_Row3 = document.getElementById("selectionIcons_Row3");
var selectionIcons_Row4 = document.getElementById("selectionIcons_Row4");

// Get popupBox Elements
//--------------------------------------------------------------------------------------------------
var popupBox_Main = document.getElementById("popupBox_Main");
var popupBox_Title = document.getElementById("popupBox_Title");
var popupBox_Content = document.getElementById("popupBox_Content");
var popupBox_SubContent = document.getElementById("popupBox_SubContent");


// Timer Stuff
//--------------------------------------------------------------------------------------------------
var treatContinuationTimer; // Delay for treat popup box to continue - Time in seconds
const treatContinuationTime = 10; // Default is 10

var trickContinuationTimer; // Delay for trick popup box to continue - Time in seconds
const trickContinuationTime = 10; // Default is 10

var lightsContinuationTimer; // Delay for light change popup box to continue  - Time in seconds
const lightsContinuationTime = 15; // Default is 15

var jokeContinuationTimer; // Delay for joke popup box to continue - Time in seconds
const jokeContinuationTime = 10; // Default is 10

var jokePunchlineDelayTimer; // Delay between telling joke and displaying punchline - Time in milliseconds
const jokePunchlineDelayTime = 5000; // Default is 5000

var endPlayContinuationTimer; // Delay for candy popup box to continue - Time in seconds
const endPlayContinuationTime = 10; // Default is 10

var messageContinuationTimer; // Delay for message popup box to go away - Time in seconds - 
const messageContinuationTime = 10; // Default is 10


// Joke Stuff
//--------------------------------------------------------------------------------------------------
var JokeNumber = 0;
const jokes_array = [
    [
        "What is in a ghost's nose",
        "Boo-Gers!"
    ],
    [
        "Why didn’t the scarecrow eat dinner?",
        "He was already stuffed!"
    ],
    [
        "Which fruit is a vampire’s favorite?",
        "Neck-tarines!"
    ],
    [
        "What does a panda ghost eat?",
        "Bam-Boo!"
    ],
    [
        "What is a ghost's favorite kind of street?",
        "A Dead End!"
    ],
    [
        "What is a ghost's favorite search engine?",
        "Ghoul-gle!"
    ],
    [
        "How do spiders communicate?",
        "Through the world wide web!"
    ],
    [
        "Who do vampires buy their cookies from?",
        "The Ghoul Scouts!"
    ],
    [
        "Who did Frankenstein take to the dance?",
        "His ghoul friend!"
    ],
    [
        "Why didnt the skeleton go to the dance?",
        "He had no body to go with!"
    ],
    [
        "Where do ghosts go on vacation?",
        "Death Valley!"
    ],
    [
        "How do you fix a broken Jack-O-Lantern?",
        "With a pumpkin patch!"
    ]
]



//==================================================================================================
// Main Code
//==================================================================================================



// Random Number Generator Inclusive with Excluder
// Pass Minimum Inclusive, Maximum Inclusive and Optionally a value to exclude
//==================================================================================================
function getRandomInclusiveWithExcluder(min, max, exclude) {
    min = Math.ceil(min);
    max = Math.floor(max);
    do {
        var randNumber = Math.floor(Math.random() * (max - min + 1) + min);
    } while (randNumber == exclude);
    return randNumber;
}



//Random Prize Generator
//==================================================================================================
function getRandomPrize() {
    // Select the intended prize from pool
    // Prize 1: 1x Treat 50% Chance
    // Prize 2: 2x Treat 15% Chance
    // Prize 3: Trick and Treat 35% Chance
    let actualPrize;
    let prizeNumber = getRandomInclusiveWithExcluder(1, 100);
    if (prizeNumber > 50) {
        actualPrize = 1;
    } else if (prizeNumber > 35) {
        actualPrize = 2;
    } else {
        actualPrize = 3;
    }
    return actualPrize;
}



// Fill array with random image selection
//==================================================================================================
function GenerateIcons() {
    const numIcons = 12;
    const numImages = 36;

    // Pick 12, non-similar icons
    let imageArray = new Array();
    for (let i = 0; i < numIcons; i++) {
        do {
            var picNumber = getRandomInclusiveWithExcluder(1, numImages);
        } while (imageArray.indexOf(picNumber) != -1);
        imageArray[i] = picNumber
    }

    for (let i = 0; i < numIcons; i++) {
        //Remove existing icons
        let existingIcon = document.getElementById("pickerIcon_" + (i + 1));
        if (existingIcon != null) {
            existingIcon.remove();
        }

        //Create button and assign static values
        let icon = document.createElement("button");
        icon.style.backgroundImage = "url('images/pickerIcons/" + imageArray[i] + ".svg')"
        icon.className = "pickerIcon";
        icon.id = "pickerIcon_" + (i + 1);
        icon.style.animationIterationCount = "infinite";
        icon.onclick = function() {
            pickerIconSelected(this);
        };

        //Assign a random animation to button
        let animationNameSelector = getRandomInclusiveWithExcluder(0, 3);
        if (animationNameSelector == 0) {
            icon.style.animationName = "wiggle";
        } else if (animationNameSelector == 1) {
            icon.style.animationName = "zoom-in";
        } else if (animationNameSelector == 2) {
            icon.style.animationName = "zoom-out";
        } else if (animationNameSelector == 3) {
            icon.style.animationName = "";
        }

        //Assign a random Timing Profile
        let animationTimingSelector = getRandomInclusiveWithExcluder(0, 1);
        if (animationTimingSelector == 0) {
            icon.style.animationTimingFunction = "cubic-bezier(0.32, 0, 0.67, 0)";
        } else if (animationTimingSelector == 1) {
            icon.style.animationTimingFunction = "cubic-bezier(0.33, 1, 0.68, 1)";
        }

        //Randomize Duration and Timing
        icon.style.animationDuration = (getRandomInclusiveWithExcluder(10, 40) / 10) + "s";
        icon.style.animationDelay = (getRandomInclusiveWithExcluder(0, 10) / 10) + "s";

        //Finally add button to document
        if (i < 3) {
            selectionIcons_Row1.appendChild(icon);
        } else if (i < 6) {
            selectionIcons_Row2.appendChild(icon);
        } else if (i < 9) {
            selectionIcons_Row3.appendChild(icon);
        } else if (i < 12) {
            selectionIcons_Row4.appendChild(icon);
        }
    }
}



// Generate Prize structure
//==================================================================================================
function GeneratePrize() {
    // Reset Prize Stuff
    prizeArray = [];
    prize_1xTreat = 0;
    prize_2xTreat = 0;
    prize_TrickAndTreat = 0;

    // Pick the actual prize
    let actualPrize = getRandomPrize();

    // Set the number of selections, this helps the game feel more random
    let numSelections = getRandomInclusiveWithExcluder(4, 7);

    // Build array of possible prizes.  Sets the first 3 items to the winning prize, then fill the rest of the array randomly
    for (let i = 0; i < numSelections; i++) {
        if (i < 3) {
            // First 3 items in the array are the winning prizes
            prizeArray[i] = actualPrize;
        } else {
            // Fill the rest of the array with random prizes, no more than 2 of each type
            do {
                var count = 0;
                var nextSelection = getRandomInclusiveWithExcluder(1, 3, actualPrize);
                prizeArray.forEach(function(x) {
                    if (x == nextSelection) {
                        count++;
                    }
                })
            } while (count > 1);
            prizeArray[i] = nextSelection;
        }
    }
    document.getElementById("popBox_Utilities_CurrentWinner").innerHTML = prizeArray;
}



// Ran when an Icon is selected
//==================================================================================================
function pickerIconSelected(icon) {

    // Disable all buttons until function is finished
    var pickerIcons = document.getElementsByClassName("pickerIcon");
    for (let pickerIcon of pickerIcons) {
        pickerIcon.classList.add("disabled");
    }

    // Disable the chosen button permanently
    var selectedIcon = document.getElementById(icon.id);
    selectedIcon.disabled = "true";

    // Get random prize selection
    var prizeArrayLocation = getRandomInclusiveWithExcluder(0, prizeArray.length - 1)
    var SinglePrize = prizeArray[prizeArrayLocation];
    prizeArray.splice(prizeArrayLocation, 1);
    if (SinglePrize == 1) {
        selectedIcon.innerHTML = "Treat";
        prize_1xTreat++;
    } else if (SinglePrize == 2) {
        selectedIcon.innerHTML = "Double Treat";
        prize_2xTreat++;
    } else if (SinglePrize == 3) {
        selectedIcon.innerHTML = "Trick + Treat";
        prize_TrickAndTreat++;
    }

    // Start Icon Animation to Shrink
    selectedIcon.style.animationName = "shrink";
    selectedIcon.style.animationIterationCount = "1";
    selectedIcon.style.animationFillMode = "both";
    selectedIcon.style.animationDuration = "0.3s"
    selectedIcon.style.animationDelay = "0s"
    selectedIcon.style.animationTimingFunction = "linear"

    // Start Text Animation to Grow
    setTimeout(function() {
        selectedIcon.style.animationName = "grow";
        selectedIcon.style.animationDelay = "-0.1s"
        selectedIcon.style.backgroundImage = "none";
        selectedIcon.style.color = "#ffa500";
    }, 450)

    // Check to see if Prize has been won
    setTimeout(function() {
        if ((prize_1xTreat == 3) || (prize_2xTreat == 3) || (prize_TrickAndTreat == 3)) {
            // Disable pickerIcons and remove all animations
            for (let pickerIcon of pickerIcons) {
                pickerIcon.disabled = "true";
                pickerIcon.style.animationName = "";
                pickerIcon.style.animationDuration = "0s"
                pickerIcon.style.animationDelay = "0s"
            }
            // Check which prize was won, then trigger associated function
            if (prize_1xTreat == 3) {
                awardTreat(1);
            } else if (prize_2xTreat == 3) {
                awardTreat(2);
            } else if (prize_TrickAndTreat == 3) {
                awardTrick();
            }
        } else {
            // Re-enable buttons if no prize was won
            for (let pickerIcon of pickerIcons) {
                pickerIcon.classList.remove("disabled");
            }
        }
    }, 850)
}



// Enable/Disable Picker Icons
//==================================================================================================
function togglePickerButtons(desiredState) {
    let pickerIcons = document.getElementsByClassName("pickerIcon");
    if (desiredState == "enabled") {
        for (let pickerIcon of pickerIcons) {
            pickerIcon.disabled = "false";
        }
    } else if (desiredState == "disabled") {
        for (let pickerIcon of pickerIcons) {
            pickerIcon.disabled = "true";
        }
    } else {
        console.log("togglePickerButtons Function: Error Parsing desiredState - Should be 'enabled' or 'disabled'")
    }
}



// Close All Popup Boxes
//==================================================================================================
function hidePopupBoxes() {
    // Un-GrayOut playScreen when popupBox is present
    document.getElementById("playScreen_Main").classList.remove("grayOut");

    // Hide all popup boxes
    let popupBoxes = document.getElementsByClassName("popupBox");
    for (let popupBox of popupBoxes) {
        popupBox.classList.replace("visible", "hidden");
    }
}



// Show Specific Popup Box
//==================================================================================================
function showPopupBox(popupBoxID) {
    // Hide other popupBoxes first
    hidePopupBoxes();

    // Show new popupBoxes    
    if (typeof popupBoxID === "object") {
        var element = popupBoxID;
    } else if (typeof popupBoxID === "string") {
        var element = document.getElementById(popupBoxID);
    } else {
        console.log("showPopupBox Function: Error Parsing popupBoxID");
        return null;
    }
    element.classList.replace("hidden", "visible");

    // Grey-out playScreen when popupBox is present
    document.getElementById("playScreen_Main").classList.add("grayOut");
}



// Award Trick
//==================================================================================================
function awardTrick(forceTrick) {
    // Show popupBox
    showPopupBox("popupBox_Trick_Main");

    // Likelihood for a Joke in percent.  IE if set to '40', then there is a 40% chance of a joke, 60% chance of lights
    let jokeChance = 40;

    // Allow to force a trick to display
    let trick;
    if (forceTrick == undefined) {
        // Pick a random trick - Number between 1 and 100
        trick = getRandomInclusiveWithExcluder(1, 100);
    } else {
        // If forceTrick is 1, display a Joke, if 2 then display lights
        if (forceTrick == 1) {
            trick = jokeChance;
        }
        if (forceTrick == 2) {
            trick = jokeChance + 1;
        }
    }

    // Set button to point to either trick and clear above timer when pressed - Adjust likelihood of each trick with the below number
    if (trick <= jokeChance) {
        document.getElementById("popupBox_Trick_Button").setAttribute('onclick', 'tellJoke(); clearInterval(trickContinuationTimer);');
    } else {
        document.getElementById("popupBox_Trick_Button").setAttribute('onclick', 'pickLights(); clearInterval(trickContinuationTimer);');
    }

    // Start continuation timer
    let resetTimerCounts = trickContinuationTime;
    document.getElementById("popupBox_Trick_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
    trickContinuationTimer = setInterval(() => {
        if (resetTimerCounts > 1) {
            resetTimerCounts--;
            document.getElementById("popupBox_Trick_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
        } else {
            document.getElementById("popupBox_Trick_Button").click();
        }
    }, 1000);
}



// Award Treat
//==================================================================================================
function awardTreat(amount) {
    // Setup Messages for 1x or 2x Treat
    if (amount == 1) {
        document.getElementById("popupBox_Treat_Content").innerHTML = "Treat";
        document.getElementById("popupBox_Treat_Button").setAttribute('onclick', 'socket.emit("runFeeder", 1); clearInterval(treatContinuationTimer); endPlay();');
    } else if (amount == 2) {
        document.getElementById("popupBox_Treat_Content").innerHTML = "Double&#13;&#10;Treat";
        document.getElementById("popupBox_Treat_Button").setAttribute('onclick', 'socket.emit("runFeeder", 2); clearInterval(treatContinuationTimer); endPlay();');
    }

    // Light up Candy Chute
    socket.emit('lightCandyChute', true);

    // Show popupBox
    showPopupBox("popupBox_Treat_Main");

    // Start continuation timer
    let resetTimerCounts = treatContinuationTime;
    document.getElementById("popupBox_Treat_Timer").innerHTML = "Auto Dispense in: " + resetTimerCounts;
    treatContinuationTimer = setInterval(() => {
        if (resetTimerCounts > 1) {
            resetTimerCounts--;
            document.getElementById("popupBox_Treat_Timer").innerHTML = "Auto Dispense in: " + resetTimerCounts;
        } else {
            document.getElementById("popupBox_Treat_Button").click();
        }
    }, 1000);
}



// Tell Joke
//==================================================================================================
function tellJoke() {
    // Get joke content box
    let popupBox_Joke_Content = document.getElementById("popupBox_Joke_Content");

    // Set joke content
    popupBox_Joke_Content.innerHTML = jokes_array[JokeNumber][0];

    // Show popupBox
    showPopupBox("popupBox_Joke_Main");

    // Show joke with timing in between
    setTimeout(() => {
        popupBox_Joke_Content.style.opacity = 1;
    }, 500);
    setTimeout(() => {
        popupBox_Joke_Content.style.opacity = 0;
    }, jokePunchlineDelayTime - 300);
    setTimeout(() => {
        document.getElementById("popupBox_Joke_Content").innerHTML = jokes_array[JokeNumber][1];
        popupBox_Joke_Content.style.opacity = 1;
    }, jokePunchlineDelayTime);

    // Start continuation timer
    let resetTimerCounts = jokeContinuationTime;
    document.getElementById("popupBox_Joke_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
    jokeContinuationTimer = setInterval(() => {
        if (resetTimerCounts > 1) {
            resetTimerCounts--;
            document.getElementById("popupBox_Joke_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
        } else {
            clearInterval(jokeContinuationTimer);
            // Increase/Reset Joke Counter
            if (JokeNumber == (jokes_array.length - 1)) {
                JokeNumber = 0;
            } else {
                JokeNumber++;
            }
            popupBox_Joke_Content.style.opacity = 0;
            awardTreat(1);
        }
    }, 1000);
}



// Change Lights
//==================================================================================================
function pickLights() {
    // Set picks remaining to max
    lightPicksRemaining = lightPicksRemainingConst;
    document.getElementById("popupBox_Lights_SubContent").innerHTML = lightPicksRemaining + " Picks Left";

    // Remove lightsIconButtonSelected Class from any active icons
    let lightsIconButtonsSelected = document.getElementsByClassName("lightsIconButtonSelected");
    for (let lightsIconButtonSelected of lightsIconButtonsSelected) {
        lightsIconButtonSelected.classList.remove("lightsIconButtonSelected");
    }

    // Show popupBox
    showPopupBox("popupBox_Lights_Main");

    // Start continuation timer
    let resetTimerCounts = lightsContinuationTime;
    document.getElementById("popupBox_Lights_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
    lightsContinuationTimer = setInterval(() => {
        if (resetTimerCounts > 1) {
            resetTimerCounts--;
            document.getElementById("popupBox_Lights_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
        } else {
            clearInterval(lightsContinuationTimer);
            awardTreat(1);
        }
    }, 1000);
}



// Ran when a Light Changing Icon is selected
//==================================================================================================
function lightIconSelected(icon) {
    // Remove lightsIconButtonSelected Class from any active icons
    let lightsIconButtonsSelected = document.getElementsByClassName("lightsIconButtonSelected");
    for (let lightsIconButtonSelected of lightsIconButtonsSelected) {
        lightsIconButtonSelected.classList.remove("lightsIconButtonSelected");
    }

    // Add lightsIconButtonSelected Class to the selected icon
    document.getElementById(icon.id).classList.add("lightsIconButtonSelected");

    // Get color name from ID to send to controller
    let colorArray = (icon.id).split("_");
    let color = colorArray[colorArray.length - 1];

    socket.emit("changeLightShow", color);

    // Reduce Picks Remaining
    lightPicksRemaining--;
    if (lightPicksRemaining > 1) {
        document.getElementById("popupBox_Lights_SubContent").innerHTML = lightPicksRemaining + " Picks Left";
    } else if (lightPicksRemaining == 1) {
        document.getElementById("popupBox_Lights_SubContent").innerHTML = "1 Pick Left";
    } else if (lightPicksRemaining == 0) {
        clearInterval(lightsContinuationTimer);
        setTimeout(() => {
            awardTreat(1);
        }, 400);
    }
}



// Display incoming message
//==================================================================================================
function displayMessage(messageTitle, messageContent, messageSubContent, messageTimeout) {
    // Show Message Popup Box - Overrides all other boxes
    document.getElementById("popupBox_Message_Main").classList.replace("hidden", "visible");
    document.getElementById("popupBox_Message_Title").innerHTML = messageTitle;
    document.getElementById("popupBox_Message_Content").innerHTML = messageContent;
    document.getElementById("popupBox_Message_SubContent").innerHTML = messageSubContent;

    // Start continuation timer
    let resetTimerCounts;
    if (messageTimeout == null) {
        resetTimerCounts = messageContinuationTime;
    } else {
        resetTimerCounts = messageTimeout;
    }
    document.getElementById("popupBox_Message_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
    messageContinuationTimer = setInterval(() => {
        if (resetTimerCounts > 1) {
            resetTimerCounts--;
            document.getElementById("popupBox_Message_Timer").innerHTML = "Continuing in: " + resetTimerCounts;
        } else {
            clearInterval(messageContinuationTimer);
            document.getElementById("popupBox_Message_Main").classList.replace("visible", "hidden");
        }
    }, 1000);
}

// End Play
//==================================================================================================
function endPlay() {
    // Turn off Candy Chute Lights
    socket.emit('lightCandyChute', false);

    // Show End Play Popup Box
    showPopupBox(document.getElementById("popupBox_EndPlay_Main"));

    // Start Reset Timer
    let resetTimerCounts = endPlayContinuationTime;
    document.getElementById("popupBox_EndPlay_Timer").innerHTML = "Next Play in: " + resetTimerCounts;
    endPlayContinuationTimer = setInterval(() => {
        if (resetTimerCounts > 1) {
            resetTimerCounts--;
            document.getElementById("popupBox_EndPlay_Timer").innerHTML = "Next Play in: " + resetTimerCounts;
        } else {
            clearInterval(endPlayContinuationTimer);
            resetGame();
        }
    }, 1000);
}



// Reset Game for new play
//==================================================================================================
function resetGame() {
    console.log("Reseting Game...");
    socket.emit("changeLightShow", 'Default');
    hidePopupBoxes();
    GenerateIcons();
    GeneratePrize();
}



// Add Passcode Digits when pressed
//==================================================================================================
function addPasscodeDigit(digit) {
    if (digit != 'Enter') {
        inputPasscode += digit;
    } else {
        if (inputPasscode == utilitiesPasscode) {
            // If passcode is correct show utilities popup
            document.getElementById("popupBox_Passcode_Main").classList.replace("visible", "hidden");
            document.getElementById("popupBox_Utilities_Main").classList.replace("hidden", "visible");
        } else {
            // If passcode is incorrect hide this popup and reset passcode
            document.getElementById("popupBox_Passcode_Main").classList.replace("visible", "hidden");
        }
    }
}



// Prompt for Passcode
//==================================================================================================
function showPasscodePrompt() {
    // Reset passcode on show
    inputPasscode = '';
    document.getElementById("popupBox_Passcode_Main").classList.replace("hidden", "visible");
}



// General Startup Stuff
//==================================================================================================
function startup() {
    document.body.requestFullscreen();
    //Assign random delay to light selection buttons
    let lightsIconButtons = document.getElementsByClassName("lightsIconButton");
    for (let lightsIconButton of lightsIconButtons) {
        lightsIconButton.style.animationDuration = (getRandomInclusiveWithExcluder(10, 20) / 10) + "s";
        lightsIconButton.style.animationDelay = (getRandomInclusiveWithExcluder(0, 10) / 10) + "s";
        lightsIconButton.onclick = function() {
            lightIconSelected(this);
        };
    }
    GenerateIcons();
    GeneratePrize();
}



// Test Mode Only
function startTest(numOfPlays, timeBetweenPlays) {

}


startup();