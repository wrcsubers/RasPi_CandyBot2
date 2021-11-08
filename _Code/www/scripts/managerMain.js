var input_customMessageBox = document.getElementById("input_customMessageBox");
var input_messageBoxTimeout = document.getElementById("input_messageBoxTimeout");
var button_showQRCode = document.getElementById("button_showQRCode");
var button_closeMessageBox = document.getElementById("button_closeMessageBox");

// Force Client Reload
//==================================================================================================
function reloadClient() {
    var message = {
        type: "reloadClient"
    }
    socket.emit('messageToClient', message);
}



// Force Client to Reset Game
//==================================================================================================
function resetClientGame() {
    var message = {
        type: "resetClientGame"
    }
    socket.emit('messageToClient', message);
}



// Ran when a Light Show is selected
//==================================================================================================
function lightShowSelected(icon) {
    // Get color name from ID to send to controller
    let colorArray = (icon.id).split("_");
    let color = colorArray[colorArray.length - 1];

    socket.emit("overrideLightShow", color);
}



// Send Message to Client
//==================================================================================================
input_customMessageBox.addEventListener('keyup', event => {
    if (event.code === 'Enter') {
        var message = {
            type: "displayMessage",
            header: null,
            body: input_customMessageBox.value,
            footer: null,
            messageTimeout: input_messageBoxTimeout.value
        }
        socket.emit('messageToClient', message);
        input_customMessageBox.value = '';
    }
})



// Show QR Code
//==================================================================================================
function showQRCode() {
    var message = {
        type: "showQRCode"
    }
    socket.emit('messageToClient', message);
}



// Close Message Box
//==================================================================================================
function closeMessageBox() {
    var message = {
        type: "closeMessageBox"
    }
    socket.emit('messageToClient', message);
}