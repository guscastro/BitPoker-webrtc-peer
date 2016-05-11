import {createSession, joinSession} from './RTCDataChannel';

let input = document.createElement('textarea');

let output = document.createElement('textarea');
output.disabled = true;

let createBtn = document.createElement('button');
createBtn.textContent = 'Create';

let joinBtn = document.createElement('button');
joinBtn.textContent = 'Join';

let getAnswerBtn = document.createElement('button');
getAnswerBtn.textContent = 'Get answer';

let status = document.createElement('div');
status.innerHTML = 'Status: <br>';

let messageForm = document.createElement('form');
let messageInput = document.createElement('input');
messageInput.placeholder = 'Enter message';
messageForm.appendChild(messageInput);

let myPeer;

createBtn.addEventListener('click', function () {
	createSession().then(handleResponse);
});

joinBtn.addEventListener('click', function () {
	let description = JSON.parse(input.value);
	joinSession(description).then(handleResponse);
});

getAnswerBtn.addEventListener('click', function () {
	let description = JSON.parse(input.value);
	myPeer.connection.setRemoteDescription(new RTCSessionDescription(description));
});

messageForm.addEventListener('submit', function (event) {
	event.preventDefault();
	myPeer.sendMessage(messageInput.value);
	writeMessage(messageInput.value);
	messageInput.value = '';
});

function handleResponse(response) {
	let {peer, description} = response;
	myPeer = peer;
	output.innerHTML = JSON.stringify(description);
	myPeer.addConnectionOpenListener(() => {
		status.innerHTML += 'connection established! <br>';
	});
	myPeer.addMessageListener(message => writeMessage(message.data));
}

function writeMessage(message) {
	status.innerHTML += message + '<br>';
}

document.body.appendChild(input);
document.body.appendChild(output);
document.body.appendChild(createBtn);
document.body.appendChild(joinBtn);
document.body.appendChild(getAnswerBtn);
document.body.appendChild(messageForm);
document.body.appendChild(status);