import chai from 'chai';
import sinon from 'sinon';
import { BlindTypes, PokerMessageTypes } from '../src/Constants';
import GameSession from '../src/GameSession';
import { RTCDataChannel } from '../src/RTCDataChannel';
import * as DeckUtils from '../src/DeckUtils';
import webrtcMock from './webrtcMock';

import { postBlind, getHoleCards } from '../src/PokerAPI';

webrtcMock(global);

const sb = 5;
const bb = 10;

let dataChannel;
let gameSession;


const spanwnMocks = function () {
	dataChannel = new RTCDataChannel();
	gameSession = new GameSession(dataChannel);

	gameSession.blinds = {
		[BlindTypes.SMALL_BLIND]: sb,
		[BlindTypes.BIG_BLIND]: bb
	};
};

const expect = chai.expect;
const assert = chai.assert;

describe('PokerAPI', function () {
	let sandbox;
	beforeEach(() => {
		spanwnMocks();
		sandbox = sinon.sandbox.create();
		sandbox.stub(dataChannel, 'sendMessage');
	});

	describe('postBlind', () => {
		it('should post send message type BLIND and data of the provided value', () => {
			postBlind(gameSession, BlindTypes.BIG_BLIND);
			expect(dataChannel.sendMessage.calledOnce).to.be.true;
			const message = dataChannel.sendMessage.getCall(0).args[0];
			expect(message.type).to.equal(PokerMessageTypes.BLIND);
			expect(message.data).to.exist;
			expect(message.data.type).to.equal(BlindTypes.BIG_BLIND);
			expect(message.data.value).to.equal(bb);
		});
	});

	describe('getHoleCards', () => {
		describe('when player is in the dealer position', () => {
			beforeEach(() => {
				gameSession.state.playerPosition = 0;
				gameSession.state.dealerPosition = 0;
			});

			it('should send a valid deck', () => {
				getHoleCards(gameSession);
				expect(dataChannel.sendMessage.callCount).to.equal(1);
				const message = dataChannel.sendMessage.getCall(0).args[0];
				expect(message.type).to.equal(PokerMessageTypes.SHUFFLED_DECK);
				expect(message.data).to.exist;
				const deck = message.data;
				expect(deck).to.be.an('array');
				expect(deck.length).to.equal(52);
			});

			it('should shuffle deck before sending', () => {
				sandbox.stub(DeckUtils, 'shuffleDeck', function () {
					expect(dataChannel.sendMessage.callCount).to.equal(0);
				});
				getHoleCards(gameSession);
				expect(DeckUtils.shuffleDeck.called).to.equal(true);
			});
		});
	});

	afterEach(() => sandbox.restore);
});