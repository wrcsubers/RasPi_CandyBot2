var myPeerConnection = null;

async function startVideoFeed() {
    await createPeerConnection();
    await enableWebcams();
};

function createPeerConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.ontrack = handleTrackEvent;
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    myPeerConnection.onremovetrack = handleRemoveTrackEvent;
    myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
    console.log("New Peer Connection Created: ", myPeerConnection);
};

function handleNegotiationNeededEvent(event) {
    console.log("HandleNegotiationNeededEvent: ", event);
    myPeerConnection.createOffer().then(function(offer) {
            return myPeerConnection.setLocalDescription(offer);
        })
        .then(function() {
            var message = {
                type: "videoOffer",
                data: myPeerConnection.localDescription
            }
            socket.emit('messageToManager', message);

        })
};

function handleVideoOfferEvent(event) {
    console.log("HandleVideoOfferMessage: ", event);
    var localStream = null;
    createPeerConnection();
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
            };
            socket.emit('messageToManager', message);
        })
};

async function enableWebcams() {
    console.log("Enabling Webcams...");
    var cameraCount = 0;
    var devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
    devices.forEach(device => {
        if (device.kind === 'videoinput') {
            console.log("Found Video: ", device)
            navigator.mediaDevices.getUserMedia({
                    video: {
                        width: {
                            ideal: 1080
                        },
                        height: {
                            ideal: 1920
                        },
                        deviceId: {
                            exact: device.deviceId
                        },
                        frameRate: {
                            ideal: 20
                        }
                    },
                    audio: true
                })
                .then(function(mediaStream) {
                    cameraCount++;
                    mediaStream.getTracks().forEach(track => console.log(track));
                    mediaStream.getTracks().forEach(track => {
                        if ((cameraCount > 1) && (track.kind == 'audio')) {
                            track.stop
                        } else {
                            console.log("Track Label: " + track.label);
                            myPeerConnection.addTrack(track, mediaStream)
                        }
                    });
                    console.log("Media Stream: ", mediaStream);

                })
        }
    });
}

function startScreenShare() {
    navigator.mediaDevices.getDisplayMedia().then(function(mediaStream) {
        mediaStream.getTracks().forEach(track => console.log(track));
        mediaStream.getTracks().forEach(track => {
            myPeerConnection.addTrack(track, mediaStream)
        });
        console.log("Media Stream: ", mediaStream);

    })
}

function handleICECandidateEvent(event) {
    //console.log("HandleIceCandidateEvent: ", event);
    if (event.candidate) {
        var message = {
            type: "iceCandidate",
            data: event.candidate
        };
        socket.emit('messageToManager', message);
    };
};

function handleNewICECandidateMsg(msg) {
    //console.log("HandleNewIceCandidateMessage: ", msg);
    var candidate = new RTCIceCandidate(msg);
    myPeerConnection.addIceCandidate(candidate);
};

function handleTrackEvent(event) {
    console.log("HandleTrackEvent: ", event);
};

function handleRemoveTrackEvent(event) {
    console.log("HandleRemoveTrackEvent: ", event);
};

function handleICEConnectionStateChangeEvent(event) {
    //console.log("HandleIceConnectionStateChangeEvent: ", myPeerConnection.iceConnectionState);
};

function handleSignalingStateChangeEvent(event) {
    //console.log("HandleSignalingStateChangeEvent: ", event);
    switch (myPeerConnection.signalingState) {
        case "closed":
            closeVideoCall();
            break;
    };
};

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
    }
}

function sendMID(midRequested) {
    var transceivers = myPeerConnection.getTransceivers();
    transceivers.forEach(element => {
        if (element.mid == midRequested) {
            message = {
                type: "transceiverMid",
                data: {
                    mid: element.mid,
                    kind: element.sender.track.kind,
                    label: element.sender.track.label
                }
            };
            socket.emit('messageToManager', message);
        }
    });
}

//Sleep Function - pass in 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}