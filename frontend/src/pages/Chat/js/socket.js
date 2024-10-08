import {startTyping, stopTyping, chatHeader,
    receiveMessage, respondMessage, updatestatuUsers,} from "./conversationChat.js"

import {friendBlockedYou, updateHomeNotification, homeNotification,
    searchHome, onlineFriendsHome, updateHomeUsers, startSearchAndNotif} from "./homeSocket.js"

import { debounce } from "../../../utils/js/utils.js"

import {setEmojies} from "./emoji.js"
import {loadMoreContent, showAllMessages} from "./scrollHandler.js"
import {showFriends, showUsers, handleChatResise} from "./listchat.js"
import {sendToBackend} from "../script.js"

// ------------------ Varaibles Of Chat ------------------
export var chatSocket;
export var dataListFriends;
export var dataListUsers;
export var user;

export var notifUser = null;
export var currentSendto = null;
export const setCurrentSendTo = (newSendTo) => {
    currentSendto = newSendTo;
};


function startSocket(){
    // ------------------ Get User ------------------
    const value = localStorage.getItem('authTokens');
    const authTokens = JSON.parse(value);
    user = authTokens.user.username;

    // ------------------ Socket Connected ------------------

    var channel_name = "/ws/" + user + "/";
    chatSocket = new WebSocket(`${channel_name}`);

    chatSocket.onopen = () => {
        console.log("The connection was setup successfully!");
        startSearchAndNotif();
        sendToBackend("", "getDataHome", "");
    }

    chatSocket.onclose = (e) => console.log("Something unexpected happened!" + e.code);

    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data === null) return;
        console.log(data.type);
        if (data.type === "Error") console.log(data.error);
        // else if (data.type === "Blocked") friendBlockedYou(data);
        // else if (data.type === "reqConfirm") reqConfirm(data.listFriends);
        // else if (data.type === "reqDelete") reqDelete(data);
        else if (data.type === "getHomedata"){
            onlineFriendsHome(data["onlineFriendsHome"]);
            homeNotification(data["homeNotification"]);
        }
        // else if (data.type === "searchHome") searchHome(data);
        else if (data.type === "updateHomeUsers") updateHomeUsers(data);
        else if (data.type === 'CreatNotifChat' || data.type === 'ToPlayPingPong' || data.type === "friendRequest") 
            updateHomeNotification(data);
        else if (data.type === 'private_message_received') respondMessage(data);
        else {
            if (document.querySelector("#chat-content")) {
                if (data.type === "showUsersFriend"){
                    dataListFriends = data["showFriends"].listFriends;
                    dataListUsers = data["showUsers"].listUsers;
                    showUsers(data["showUsers"]);
                    showFriends(data["showFriends"]);
                }
                else if (data.type === "showConversation"){
                    chatHeader(data["chat_header"]);
                    showAllMessages(data["show_messages"]);
                }
                else if (data.type === "private_message_sendIt") receiveMessage(data);
                else if (data.type === "loadMoreContent") loadMoreContent(data);
                else if (data.type === "update_userlist_status") updatestatuUsers(data);
                else if (data.type === "startTyping") startTyping(data);
                else if (data.type === "stopTyping") stopTyping(data);
            }
        }
    }

}

function startChat(){
    console.log("chaT");
    if (notifUser) {
        sendToBackend(notifUser, "showConversation", "");
        notifUser = null;
    }

    window.addEventListener('resize', function() {
        if (document.querySelector("#chat-content"))
            handleChatResise();
    });

    sendToBackend("", "showUsersFriend", "");

    const messageInput = document.querySelector("#id_message_send_input");
    const messageSendButton = document.querySelector("#id_message_send_button");
    messageInput.focus();
    setEmojies();

    let hasStartedTyping = false;
    const debouncedtypingValue = debounce(userStoppedTyping, 1000);
    
    messageInput.onkeyup = function (e) {
        if (!hasStartedTyping){
            sendToBackend(currentSendto, "startTyping", "");
            hasStartedTyping = true;
        }

        debouncedtypingValue();

        if (e.keyCode === 13) {
            hasStartedTyping = false;
            sendToBackend(currentSendto, "stopTyping", "");
            messageSendButton.dispatchEvent(new Event('click'));
        }
    };

    function userStoppedTyping() {
        hasStartedTyping = false;
        sendToBackend(currentSendto, "stopTyping", "");
    }

    messageSendButton.addEventListener('click', () => {
        const message = messageInput.value;
        var emoji = document.querySelector(".list-emoji");
        messageInput.value = "";
        if (message.trim() != "") {
            if (emoji)
                emoji.classList.add("d-none");
            sendToBackend(currentSendto, "message", message);
        }
    });
}

export {
    startSocket,
    sendToBackend,
    startChat,
}