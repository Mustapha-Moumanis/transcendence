import { getCookie } from "../../utils/js/utils.js";
import { startChat, chatSocket, waitForSocketConnection} from "./js/socket.js";

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
	if (chatSocket.readyState !== chatSocket.OPEN){
		console.warn("SOUAD : Closed");
		return;
	}
	chatSocket.send(JSON.stringify({
		token: myToken,
		type: type,
		sendto: sendto,
		message: message,
	}));
}

export function chatActions() {
	waitForSocketConnection(chatSocket, startChat);
}