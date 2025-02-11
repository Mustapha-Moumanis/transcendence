import { getCookie } from "../../utils/js/utils.js";
import { startChat, chatSocket, waitForSocketConnection} from "./js/socket.js";

export var lastCmd = [];

export function sendToBackend(sendto, type, message){
	let myToken = getCookie('my-token');
	if (!(type === "startTyping" || type === "stopTyping" || type === "addFrindship")){
		lastCmd.push({
			type: type,
			sendto: sendto,
			message: message,
		});
	}
	if (chatSocket == null || chatSocket.readyState !== chatSocket.OPEN)
		return;

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