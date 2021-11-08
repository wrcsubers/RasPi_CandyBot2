//Connect to Socket.IO
var socket = io('https://192.168.1.40/');

//Notify Server that this is a client
socket.emit('clientConnected', true);

// Handle Connects and Disconnects
socket.on("connect", () => {
    document.getElementById("serverStatus").innerHTML = "&#128994;";
});

socket.on("connect_error", () => {
    document.getElementById("serverStatus").innerHTML = "&#128308;";
});

socket.on("disconnect", () => {
    document.getElementById("serverStatus").innerHTML = "&#128308;";
});


// Handle messages from Manager
socket.on("messageFromManager", (message) => {
    console.log('Message From Manager: ', message);
    if (message.type === 'clientVideoRequest') {
        startVideoFeed();
    } else if (message.type === 'videoAnswer') {
        myPeerConnection.setRemoteDescription(message.data);
    } else if (message.type === 'iceCandidate') {
        handleNewICECandidateMsg(message.data);
    } else if (message.type === 'terminateStream') {
        endStream();
    } else if (message.type === 'requestMID') {
        sendMID(message.data);
    } else if (message.type == 'displayMessage') {
        if (message.messageTimeout <= 1) {
            message.messageTimeout = null;
        }
        displayMessage(
            message.header,
            message.body,
            message.footer,
            message.messageTimeout
        );
    } else if (message.type == 'closeMessageBox') {
        document.getElementById("popupBox_Message_Main").classList.replace("visible", "hidden");
        clearInterval(messageContinuationTimer);
    } else if (message.type == 'showQRCode') {
        displayMessage(
            'Want to see how it works?',
            "<img src=\"\/images\/other\/qrCode.svg\" width=\"600px\" height=\"600px\">",
            'Scan the QR Code to learn more',
            20
        );
    } else if (message.type == 'reloadClient') {
        location.reload();
    } else if (message.type == 'resetClientGame') {
        resetGame();
    }
})