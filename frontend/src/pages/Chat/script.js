import { getCookie } from "../../utils/js/utils.js";
import { startChat, chatSocket } from "./js/socket.js";

export var lastCmd = [];

export function sendToBackend(sendto, type, message){
	const myToken = getCookie('my-token');
	if (!(type === "startTyping" || type === "stopTyping")){
		lastCmd.push({
			type: type,
			sendto: sendto,
			message: message,
		});
	}
	
	console.log(type);
	chatSocket.send(JSON.stringify({
		token: myToken,
		type: type,
		sendto: sendto,
		message: message,
	}));
}

export function chatActions() {
	startChat();
}