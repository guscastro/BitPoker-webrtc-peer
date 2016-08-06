import { PokerMessageTypes } from './Constants';
import RTCDataChannel from './RTCDataChannel';
import createDeck from './createDeck';
import { shuffleDeck } from './DeckUtils';

const NUMBER_HOLE_CARDS = 2;

export function waitOnMessage(gameSession, ...expectedTypes) {
	return gameSession.channelListener.receiveMessage(message => expectedTypes.indexOf(message.type) !== -1);
}

export function getSessions() {
	throw new Error('PokerAPI.getSessions not implemented');
}

export function joinSession(sessionId) {

}

export function postBlind(gameSession, type) {
	let value = gameSession.blinds[type]
	let blind = {
		type,
		value
	};
	let message = {
		type: PokerMessageTypes.BLIND,
		data: blind
	};

	return gameSession.dataChannel.sendMessage(message);
}

export function bet(gameSession, value) {
	let bet = {
		value
	};
	let message = {
		type: PokerMessageTypes.BET,
		data: bet
	};

	return gameSession.dataChannel.sendMessage(message);
}

export function fold(gameSession) {
	let message = {
		type: PokerMessageTypes.FOLD
	};

	return gameSession.dataChannel.send(message);
}

export function getHoleCards(gameSession) {
	let message = {
		type: PokerMessageTypes
	};

	const isDealer = gameSession.state.dealerPosition === gameSession.state.playerPosition;

	return new Promise(resolve => {
		// todo meeeeh
		if (isDealer) {
			let deck = createDeck();
			shuffleDeck(deck);
			sendShuffledDeckMessage(gameSession, deck);
			waitOnMessage(gameSession, PokerMessageTypes.SHUFFLED_DECK)
			.then(function shuffledDeckReceived(message) {
				deck = message.data;
				let holeCards = getHoleCardsFromShuffledDeck(gameSession, deck);
				gameSession.state.deck = deck;
				resolve(holeCards);
			});
		} else {
			waitOnMessage(gameSession, PokerMessageTypes.SHUFFLED_DECK)
			.then(function shuffledDeckReceived(message) {
				let deck = message.data;
				shuffleDeck(deck);
				sendShuffledDeckMessage(gameSession, deck);
				let holeCards = getHoleCardsFromShuffledDeck(gameSession, deck);
				gameSession.state.deck = deck;
				resolve(holeCards);
			});
		}
	});
}

export function getFlop(gameSession) {

}

export function getTurn(gameSession) {

}

export function getRiver(gameSession) {

}

function sendShuffledDeckMessage(gameSession, deck) {
	let message = {
		type: PokerMessageTypes.SHUFFLED_DECK,
		data: deck
	};
	gameSession.dataChannel.sendMessage(message);
}

function getHoleCardsFromShuffledDeck(gameSession, deck) {
	let playerPosition = gameSession.state.myPosition;
	let offset = playerPosition * NUMBER_HOLE_CARDS;
	return deck.slice(offset, NUMBER_HOLE_CARDS);
}