import { startChat } from "./js/socket.js";
import { chatSocket } from "./js/socket.js";

export function sendToBackend(sendto, type, message){

	chatSocket.send(JSON.stringify({
		type: type,
		sendto: sendto,
		message: message,
	}));
}

export function chatActions() {
	document.addEventListener("DOMContentLoaded", function() {
		console.log("Window is fully loaded!");
	});
	startChat();
}