import {startTyping, stopTyping, chatHeader,receiveMessage, respondMessage, 
    updatestatuUsers,loadMoreContent, showAllMessages, stratChatBox } from "./conversationChat.js"

import {friendBlockedYou, updateHomeNotification, homeNotification,
    searchHome, onlineFriendsHome, updateHomeUsers, startSearchAndNotif,
    reqDelete, reqConfirm} from "./homeSocket.js"

import {showFriends, showUsers, handleChatResise} from "./listchat.js"
import {lastCmd, sendToBackend} from "../script.js"
import { showAlert, verifyRefreshToken } from "../../../utils/js/auth.js";
import { getCookie, logoutFetch } from "../../../utils/js/utils.js";

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


function setupWebSocket() {
    // ------------------ Get User ------------------
    const userData = JSON.parse(localStorage.getItem('userData'));
    user = userData.username;
    console.log(user);
    console.log(getCookie('my-token'));
    const protocol = 'ws://';
    const wsUrl = `${protocol}${window.location.host}/ws/${user}/`;
    return new WebSocket(wsUrl);
}

function restartWebsocket(){
    if (chatSocket)
        chatSocket.close();
    startSocket();
    // waitForSocketConnection(chatSocket, ()=> {

    // })
}

function waitForSocketConnection(socket, callback){
    setTimeout(function () {
        if (socket.readyState === 1) {
            if (callback)
                callback();
        } else {
            console.log("wait for connection...")
            waitForSocketConnection(socket, callback);
        } }, 5);
}

function startSocket(){
    chatSocket = setupWebSocket();
    waitForSocketConnection(chatSocket, getData);

    chatSocket.onopen = () => {
        console.log("The connection was setup successfully!");
    }

    chatSocket.onclose = (e) => {
        console.log("The Websocket was Closed!");
    }

    function getData(){
        sendToBackend("", "getDataHome", "");
    }

    chatSocket.onmessage = handleMessageFromSocket;
}

function handleMessageFromSocket(event){
    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data === null) return;
        console.log("=======>", data.type);

        if (data.type !== "Error"){
            console.log("=======>",lastCmd);
            
            lastCmd.splice(0,1);

        }
        console.log(lastCmd);

        if (data.type === "Error"){
            chatSocket.close();
            console.warn(data.error);
            verifyRefreshToken()
                .then(() => {
                    restartWebsocket();
                })
                .catch (error => {
                    showAlert('error', error);
                    logoutFetch()
                    .catch(() => {});
                })
        }
            
        else if (data.type === "Blocked") friendBlockedYou(data);
        else if (data.type === "reqConfirm") reqConfirm(data.listFriends);
        else if (data.type === "reqDelete") reqDelete(data);
        else if (data.type === "getHomedata"){
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