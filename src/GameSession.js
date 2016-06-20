import RTCDataChannelBufferedListener from './RTCDataChannelBufferedListener';

export default class GameSession {
	constructor(dataChannel) {
		this.dataChannel = dataChannel;
		this.channelListener = new RTCDataChannelBufferedListener(dataChannel);

		this.state = getDefaultState();
	}
}

function getDefaultState() {
	return {
		dealerPosition: 0
	};
}