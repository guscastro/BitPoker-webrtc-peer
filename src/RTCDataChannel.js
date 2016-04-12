// this might be required for NATs
const rtcConfiguration = undefined;//{'iceServers': [{'url': 'stun:23.21.150.121'}]};
// this might be required for FF-Chrome interoperability
const rtcAdditionalConfiguration = undefined;//{ 'optional': [{'DtlsSrtpKeyAgreement': true}] };

const sdpConstraints = {
  optional: [],
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  }
};

export function createSession() {
  const peer = new RTCDataChannel();
  const promise = onicecandidatePromise(peer);

  createDataChannel(peer);

  peer.connection.createOffer()
    .then(offer => peer.connection.setLocalDescription(offer));

  return promise;
}

export function joinSession(remoteSessionDescription) {
  const peer = new RTCDataChannel();

  joinDataChannel(peer);

  const offerDescription = new RTCSessionDescription(remoteSessionDescription);
  const promise = onicecandidatePromise(peer);
  peer.connection.setRemoteDescription(offerDescription);
  peer.connection.createAnswer(
    answer => peer.connection.setLocalDescription(answer),
    err => console.error(err));
  return promise;
}

class RTCDataChannel {
  constructor() {
    let self = this;
    this.connection = new RTCPeerConnection(rtcConfiguration, rtcAdditionalConfiguration);
    this.connectionOpenListeners = [];
    this.messageListeners = [];
  }

  addConnectionOpenListener(listener) {
    this.connectionOpenListeners.push(listener);
  }

  addMessageListener(listener) {
    this.messageListeners.push(listener);
  }

  sendMessage(message) {
    this.dataChannel.send(message);
  }
}

function onicecandidatePromise(peer) {
  let resolver;
  let promise = new Promise((resolve, reject) => resolver = resolve);

  peer.connection.onicecandidate = function (e) {
    if (e.candidate == null) {
      resolver({
        peer,
        description: peer.connection.localDescription
      });
    }
  };

  return promise;
}

function createDataChannel(peer) {
  peer.dataChannel = peer.connection.createDataChannel('test', { reliable: true });
  wireUpDataChannel(peer);
}

function joinDataChannel(peer) {
  peer.connection.ondatachannel = function (e) {
    peer.dataChannel = e.channel || e;
    wireUpDataChannel(peer);
  };
}

function wireUpDataChannel(peer) {
  peer.dataChannel.onopen = function () {
    peer.connectionOpenListeners.forEach(listener => listener());
  };

  peer.dataChannel.onmessage = function (message) {
    peer.messageListeners.forEach(listener => listener(message));
  };
}