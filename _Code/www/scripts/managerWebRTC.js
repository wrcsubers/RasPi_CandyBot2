var div_remoteDisplays = document.getElementById("remote_Displays");
var video1 = document.getElementById("Video1");
var video2 = document.getElementById("Video2");
var audio0 = document.getElementById("Audio0");
audio0.volume = 1;

var cameraCount = 0;

var connectVideo_button = document.getElementById("connectVideo_button");
connectVideo_button.addEventListener("click", makeCall);
connectVideo_button.innerHTML = "Start Stream";

var myPeerConnection = null;

socket.on('messageFromClient', async(message) => {
    console.log('Message From Client: ', message);
    if (message.type === 'videoOffer') {
        handleVideoOfferEvent(message.data);
    } else if (message.type === 'iceCandidate') {
        handleNewICECandidateMsg(message.data);
    } else if (message.type === 'transceiverMid') {
        handleTransceiverMid(message.data);
    }
})

async function makeCall() {
    connectVideo_button.disabled = true;
    console.log("Requesting Client Video...");
    // Send Client video request
    var message = {
        type: "clientVideoRequest",
        data: null
    }
    socket.emit('messageToClient', message);
}

function createPeerConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.ontrack = handleTrackEvent;
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    myPeerConnection.onremovetrack = handleRemoveTrackEvent;
    myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
    console.log("New Peer Connection Created:", myPeerConnection);
    //Change Call Button to Hangup
    if (myPeerConnection) {
        connectVideo_button.removeEventListener("click", makeCall);
        connectVideo_button.addEventListener("click", endStream);
        connectVideo_button.innerHTML = "End Stream";
        connectVideo_button.disabled = false;
    }
}

function handleNegotiationNeededEvent(event) {
    console.log("HandleNegotiationNeededEvent:", event);
    myPeerConnection.createOffer().then(function(offer) {
            return myPeerConnection.setLocalDescription(offer);
        })
        .then(function() {
            var message = {
                type: "videoOffer",
                data: myPeerConnection.localDescription
            }
            socket.emit('messageToClient', message);

        })
}

async function handleVideoOfferEvent(event) {
    console.log("HandleVideoOfferEvent:", event);
    if (!myPeerConnection) {
        await createPeerConnection();
    }
    myPeerConnection.setRemoteDescription(event)
        .then(function() {
            return myPeerConnection.createAnswer();
        })
        .then(function(answer) {
            return myPeerConnection.setLocalDescription(answer);
        })
        .then(function() {
            var message = {
                type: "videoAnswer",
                data: myPeerConnection.localDescription
            }
            socket.emit('messageToClient', message);
        })
}

function handleICECandidateEvent(event) {
    console.log("HandleIceCandidateEvent:", event);
    if (event.candidate) {
        var message = {
            type: "iceCandidate",
            data: event.candidate
        }
        socket.emit('messageToClient', message);
    }
}

function handleNewICECandidateMsg(msg) {
    console.log("HandleNewIceCandidateEvent:", msg)
    var candidate = new RTCIceCandidate(msg);
    myPeerConnection.addIceCandidate(candidate);
}

function handleTrackEvent(event) {
    console.log("HandleTrackEvent:", event);
    addMediaStream(event);
}

function handleRemoveTrackEvent(event) {
    console.log("HandleRemoveTrackEvent:", event);
}

function handleICEConnectionStateChangeEvent(event) {
    console.log("HandleIceConnectionStateChangeEvent:", myPeerConnection.iceConnectionState);
}

function handleSignalingStateChangeEvent(event) {
    console.log("HandleSignalingStateChangeEvent:", event);
    switch (myPeerConnection.signalingState) {
        case "closed":
            endStream();
            break;
    }
};

function handleTransceiverMid(data) {
    console.log(data.mid, data.kind, data.label);
    //document.getElementById("media" + data.mid + "H2").innerHTML = data.label
}

async function addMediaStream(track) {
    console.log("vs ", video1.srcObject);
    // Create New Div for each stream
    if (track.track.kind == "video") {
        if (!video1.srcObject) {
            video1.srcObject = track.streams[0];
        } else if (!video2.srcObject) {
            video2.srcObject = track.streams[0];
        }
    } else if (track.track.kind == "audio") {
        audio0.srcObject = track.streams[0];
    }

    var message = {
        type: "requestMID",
        data: track.transceiver.mid
    }
    socket.emit('messageToClient', message);
}

function endStream() {
    console.log("Ending Stream!")
    if (myPeerConnection) {
        myPeerConnection.ontrack = null;
        myPeerConnection.onremovetrack = null;
        myPeerConnection.onremovestream = null;
        myPeerConnection.onicecandidate = null;
        myPeerConnection.oniceconnectionstatechange = null;
        myPeerConnection.onsignalingstatechange = null;
        myPeerConnection.onicegatheringstatechange = null;
        myPeerConnection.onnegotiationneeded = null;

        myPeerConnection.close();
        myPeerConnection = null;

        connectVideo_button.removeEventListener("click", endStream);
        connectVideo_button.addEventListener("click", makeCall);
        connectVideo_button.innerHTML = "Start Stream";
        connectVideo_button.disabled = false;

        var message = {
            type: "terminateStream",
            data: null
        }
        socket.emit('messageToClient', message);
    }
}