export default function webrtcMock(global) {
	global.RTCPeerConnection = function RTCPeerConnection() {};
	global.RTCPeerConnection.prototype = {
		createOffer: function () {
			return Promise(resolve => resolve({}))
		},
		setRemoteDescription: function() {},
		createAnswer: function() {},
		createDataChannel: function() {}
	};
}