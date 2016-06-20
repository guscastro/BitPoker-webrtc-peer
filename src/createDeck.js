import {Ranks, Suits} from './Constants';
import objectEntries from './common/objectEntries';

export default function createDeck() {
	let deck = [];
	for (let [_, suit] of objectEntries(Suits)) {
		for (let [__, rank] of objectEntries(Ranks)) {
			deck.push({ suit, rank });
		}
	}
}