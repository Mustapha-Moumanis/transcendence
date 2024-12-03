import {startTyping, stopTyping, chatHeader,receiveMessage, respondMessage, 
    updatestatuUsers,loadMoreContent, showAllMessages, startChatBox } from "./conversationChat.js"

import {friendBlockedYou, updateHomeNotification, homeNotification,
    searchHome, onlineFriendsHome, updateHomeUsers, startSearchAndNotif,
    reqDelete, reqConfirm} from "./homeSocket.js"

import {showFriends, showUsers, handleChatResise} from "./listchat.js"
import {lastCmd, sendToBackend} from "../script.js"
import { logout, showAlert, verifyRefreshToken } from "../../../utils/js/auth.js";
import { logoutFetch } from "../../../utils/js/utils.js";

// ------------------ Varaibles Of Chat ------------------
export var chatSocket;
export var channelBroadcast;
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

function setupWebSocket() {
    // ------------------ Get User ------------------
    const userData = JSON.parse(localStorage.getItem('userData'));
    user = userData.username;

    let welcome = document.querySelector(".welcome h5");
    welcome.innerHTML = `Welcome ${user}`;

    const protocol =  window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = `${protocol}${window.location.host}/ws/${user}/`;
    channelBroadcast = new BroadcastChannel("auth_channel");
    return new WebSocket(wsUrl);
}

function restartWebsocket(){
    if (chatSocket) chatSocket.close();
    startSocket();
}

function waitForSocketConnection(socket, callback){
    setTimeout(function () {
        if (socket.readyState === WebSocket.OPEN) {
            if (callback)
                callback();
        } 
        else {
            console.log("wait for connection...");
            waitForSocketConnection(socket, callback);
        } 
    }, 5);
}

function callLastCmds(){
    let arrayCmds =  Array.from(lastCmd);
    for (let index = 0; index < arrayCmds.length; index++) {
        const cmd = arrayCmds[index];
        sendToBackend(cmd.sendto, cmd.type, cmd.message);
    }
}

function startSocket(){
    if (chatSocket) return;
    else chatSocket = setupWebSocket();
    waitForSocketConnection(chatSocket, getData);

    chatSocket.onopen = () => {
        console.log("The connection was setup successfully!");
    }

    chatSocket.onclose = (e) => {
        chatSocket = null;
        console.log("The Websocket was Closed!", e);
    }

    function getData(){
        if (lastCmd.length > 0) callLastCmds();
        else sendToBackend("", "getDataHome", "");
    }

    chatSocket.onmessage = handleMessageFromSocket;

    channelBroadcast.onmessage = (event) => {
        if (event.data.type === "logout") {
            channelBroadcast.close();
            logout();
        }
    };
}

function handleRefrshTocken(){
    chatSocket.close();
    verifyRefreshToken()
    .then(() => restartWebsocket())
    .catch (error => {
        showAlert('error', error);
        logoutFetch()
        .catch(() => {});
    })
}

function handleMessageFromSocket(event){
    const data = JSON.parse(event.data);
    if (data === null || document.querySelector(".gameInterface")) 
        return;

    if (data.type === "Error") handleRefrshTocken();
    else lastCmd.splice(0,1);

    if (data.type === "Blocked") friendBlockedYou(data);
    else if (data.type === "reqConfirm") reqConfirm(data.listFriends);
    else if (data.type === "reqDelete") reqDelete(data);
    else if (data.type === "getDataHome"){
        onlineFriendsHome(data["onlineFriendsHome"]);
        homeNotification(data["homeNotification"]);
    }
    else if (data.type === "searchHome")searchHome(data);
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
                handleChatResise();
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

function startChat(){
    if (notifUser) {
        setCurrentSendTo(notifUser);
        sendToBackend(notifUser, "showConversation", "");
        notifUser = null;
    }
    else setCurrentSendTo(null);
    
    sendToBackend("", "showUsersFriend", "");

    window.addEventListener('resize', function() {
        if (document.querySelector("#chat-content"))
            handleChatResise();
    });
    startChatBox();
}

export {
    waitForSocketConnection,
    startSocket,
    sendToBackend,
    startChat,
}