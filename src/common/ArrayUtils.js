// http://stackoverflow.com/a/6274398
export function shuffleArray(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export function arrayRemove(array, element) {
	let index = array.indexOf(index);
	if (index !== -1) {
		array.splice(index, 1);
	}
}
