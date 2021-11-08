//Connect to Socket.IO
var socket = io('https://192.168.1.40/');

//Notify Server that this is a client
socket.emit('managerConnected', true);

// Handle Connects and Disconnects
socket.on("connect", () => {
    document.getElementById("serverStatus").innerHTML = "Server Connection: &#128994;";
});

socket.on("connect_error", () => {
    document.getElementById("serverStatus").innerHTML = "Server Connection: &#128308;";
});

socket.on("disconnect", () => {
    document.getElementById("serverStatus").innerHTML = "Server Connection: &#128308;";
});

socket.on('connectionStatus', (data) => {
    console.log("ConnectionStatus: " + data)
    if (data[0] == true) {
        document.getElementById("clientStatus").innerHTML = "Client Connection: &#128994;";
    }
    if (data[0] == false) {
        document.getElementById("clientStatus").innerHTML = "Client Connection: &#128308;";
    }
});