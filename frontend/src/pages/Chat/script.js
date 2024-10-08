import {startSocket, startChat} from "./js/socket.js";
import { chatSocket} from "./js/socket.js";

export function sendToBackend(sendto, type, message){

	chatSocket.send(JSON.stringify({
		type: type,
		sendto: sendto,
		message: message,
	}));
}

export function chatActions() {
	startChat();
}