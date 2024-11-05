import {startTyping, stopTyping, chatHeader,receiveMessage, respondMessage, 
    updatestatuUsers,loadMoreContent, showAllMessages, stratChatBox } from "./conversationChat.js"

import {friendBlockedYou, updateHomeNotification, homeNotification,
    searchHome, onlineFriendsHome, updateHomeUsers, startSearchAndNotif,
    reqDelete, reqConfirm} from "./homeSocket.js"

import {showFriends, showUsers, handleChatResise} from "./listchat.js"
import {sendToBackend} from "../script.js"

// ------------------ Varaibles Of Chat ------------------
export var chatSocket;
export var dataListFriends;
export var dataListUsers;
export var user;

export var notifUser = null;
export const setnotifUser = (newnotifUser) => {
    notifUser = newnotifUser;
};

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

    chatSocket.onclose = (e) => {}

    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data === null) return;
    
        if (data.type === "Error") console.error(data.error);
        else if (data.type === "Blocked") friendBlockedYou(data);
        else if (data.type === "reqConfirm") reqConfirm(data.listFriends);
        else if (data.type === "reqDelete") reqDelete(data);
        else if (data.type === "getHomedata"){
            onlineFriendsHome(data["onlineFriendsHome"]);
            homeNotification(data["homeNotification"]);
        }
        else if (data.type === "searchHome") {
            console.log(data);
            searchHome(data);
        }
        else if (data.type === "updateHomeUsers") updateHomeUsers(data);
        else if (data.type === 'CreatNotifChat' || data.type === "friendRequest") 
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
                    stratChatBox();
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

    if (notifUser) {
        setCurrentSendTo(notifUser);
        sendToBackend(notifUser, "showConversation", "");
        notifUser = null;
    }
    
    sendToBackend("", "showUsersFriend", "");

    window.addEventListener('resize', function() {
        if (document.querySelector("#chat-content"))
            handleChatResise();
    });
}

export {
    startSocket,
    sendToBackend,
    startChat,
}