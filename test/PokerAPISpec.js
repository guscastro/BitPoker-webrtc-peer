import chai from 'chai';
import sinon from 'sinon';
import { BlindTypes, PokerMessageTypes } from '../src/Constants';
import GameSession from '../src/GameSession';
import { RTCDataChannel } from '../src/RTCDataChannel';
import webrtcMock from './webrtcMock';

import { postBlind } from '../src/PokerAPI';

webrtcMock(GLOBAL);

const sb = 5;
const bb = 10;

const dataChannel = new RTCDataChannel();
const gameSession = new GameSession(dataChannel);

gameSession.blinds = {
	[BlindTypes.SMALL_BLIND]: sb,
	[BlindTypes.BIG_BLIND]: bb
};

const expect = chai.expect;
const assert = chai.assert;

describe('PokerAPI', function () {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	describe('postBlind', () => {
		it('should post send message type BLIND and data of the provided value', function () {
			sandbox.stub(dataChannel, 'sendMessage');
			postBlind(gameSession, BlindTypes.BIG_BLIND);
			expect(dataChannel.sendMessage.calledOnce).to.be.true;
			const message = dataChannel.sendMessage.getCall(0).args[0];
			expect(message.type).to.equal(PokerMessageTypes.BLIND);
			expect(message.data).to.exist;
			expect(message.data.type).to.equal(BlindTypes.BIG_BLIND);
			expect(message.data.value).to.equal(bb);
		});
	});

	afterEach(() => sandbox.restore);
});