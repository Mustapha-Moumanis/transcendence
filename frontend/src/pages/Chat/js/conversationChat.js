import {user, currentSendto, sendToBackend} from "./socket.js"
import {activeBtn} from "./listchat.js"
import {blockClick, removeNotif} from "./homeSocket.js"
import {setEmojies} from "./emoji.js"
import { debounce } from "../../../utils/js/utils.js"

const handlerReference = (event) => scrollHandler(event);
var scrollDisplay = false;
var oldScrollHeight = 0;
var scrollnb = 0;

// ------------- Scroll Handler -------------
function smoothScrollToBottom(container) {
    container.scroll({
        top: container.scrollHeight,
        behavior: 'smooth'
    });
}

function loadingContent(){
    const container = document.querySelector("#id_chat_item_container");
    const div = document.createElement("div");
    div.classList.add("chat-loading");
    div.innerHTML = `
            <div class="chat-line"></div>type="file"
    `;
    container.appendChild(div);
    scrollnb++;
    removeScroll();
    sendToBackend(currentSendto, "loadMoreContent", scrollnb);
}

function scrollHandler() {
    const scrollelement = document.querySelector(".chat-box");
    oldScrollHeight = scrollelement.scrollHeight;
    var scrollPositionY = scrollelement.clientHeight- scrollelement.scrollTop;

    if (scrollPositionY === oldScrollHeight && scrollDisplay === true)
        loadingContent();
}

function focusScroll() {
    const scrollelement = document.querySelector(".chat-box");
    scrollelement.addEventListener('scroll', handlerReference);
}

function removeScroll() {
    const scrollelement = document.querySelector(".chat-box");
    scrollelement.removeEventListener('scroll', handlerReference);
}

// ---------------------- Chat Box --------------------
function showAllMessages(data) {

    removeNotif(data.sendto, ".notifMessage");

    var messages = data['messages'];
    const container = document.querySelector("#id_chat_item_container");
    container.innerHTML = '';
    messages.forEach(message => {
        container.appendChild(createMessageElement(message));
        smoothScrollToBottom(container);
    });
    document.querySelector("#id_message_send_input").value = "";

    document.querySelector(".loading-chat").classList.add("d-none");
    document.querySelector(".main-chat").classList.remove("d-none");
    
    scrollnb = 0;
    oldScrollHeight = 0;
    scrollDisplay = data["scrollDisplay"];
    if (!scrollDisplay) {
        container.appendChild(createEndOfConv(data));
        removeScroll();
    }
    else {
        let height = window.innerHeight; 
        if (height > 1000)
            loadingContent();
    }
    focusScroll();
}

function loadMoreContent(data){

    var messages = data['messages'];
    document.querySelector(".chat-loading").remove();

    const container = document.querySelector("#id_chat_item_container");
    messages.forEach(message => {
        container.appendChild(createMessageElement(message));
    });

    scrollDisplay = data["scrollDisplay"];
    if (!scrollDisplay) {
        container.appendChild(createEndOfConv(data));
        removeScroll();
    }
    focusScroll();
}

// ------------------ Upadate chat------------------

function updateNotification(data) {
    const messageBtn = document.querySelector(".chat-msg-btn");
    activeBtn(messageBtn, ".chat-friend-btn", ".chat-list", ".friend-chat");
    document.querySelectorAll(".chat-list .chat-user-card").forEach(cardUser => {
        const username = cardUser.querySelector(".chat-user-content h5").innerHTML;
        if (username === data.username) {
            var notf = cardUser.querySelector('.chat-notification');
            notf.classList.remove('d-none');
            cardUser.querySelector('.chat-notification').innerHTML = Number(notf.innerHTML) + 1;
            cardUser.querySelector('.chat-user-content p').innerHTML = data.message;
            return;
        }
    });
}

function updatestatuUsers(data) {
    document.querySelectorAll(".chat-list .chat-user-card").forEach(userCardstatus => {
        const username = userCardstatus.querySelector(".chat-user-content h5").innerHTML;
        if (username === data.username) {
            const statusSpan = userCardstatus.querySelector('.chat-user-status');
            statusSpan.classList.remove('Online', 'Offline');
            statusSpan.classList.add(data.status);
            if (userCardstatus.classList.contains('chat-card-active'))
                document.querySelector('.chat-header .chat-user-content p').innerHTML = data.status.toLowerCase();
            return;
        }
    });
}

// ---------------- Main chat ---------------------

function respondMessage(data) {
    if (document.querySelector("#chat-content")){
        const room = document.querySelector(".chat-card-active .chat-user-content h5");
        if (room == null || room.innerHTML != data.username) updateNotification(data);
        else {
            const container = document.querySelector("#id_chat_item_container");
            container.prepend(createMessageElement(data));
            smoothScrollToBottom(container);
            sendToBackend(data.username, "UpdatSeen", "");
        }
        sendToBackend("", "showUsersFriend", "");
    }
    else
        sendToBackend(data.username, "CreatNotifChat", "");
}

function receiveMessage(data) {
    const messageBtn = document.querySelector(".chat-msg-btn");
    activeBtn(messageBtn, ".chat-friend-btn", ".chat-list", ".friend-chat");

    const messageElement = createMessageElement(data);
    const container = document.querySelector("#id_chat_item_container");
    container.prepend(messageElement);
    document.querySelector("#id_message_send_input").value = "";
    smoothScrollToBottom(container);
    sendToBackend("", "showUsersFriend", "");
}

function CloseMainChat() {
    var chatUsersList = document.querySelector(".chat-sidebar");
    var mainChat = document.querySelector(".main-chat");
    chatUsersList.removeAttribute('style');
    mainChat.style.zIndex = "0";
}

function addEventListenerChatObtions(data) {
    const namelist = document.querySelector(".chat-options-list");
    document.querySelector("#id_chat-options").addEventListener('click', (event) => {
        event.stopPropagation();
        if (namelist.classList.contains("d-none"))
            namelist.classList.remove("d-none");
        else
            namelist.classList.add("d-none");
    });

    namelist.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    document.body.addEventListener('click', () => {
        if (namelist.classList.contains("d-none"))
            return;
        namelist.classList.add("d-none");
    });

    document.querySelector("#chat-show-profile").addEventListener('click', () => {
        namelist.classList.add("d-none");
        window.location.hash = `#profile?id=${data.id}`;
    });
    document.querySelector("#chat-block-friend").addEventListener('click', () => {
        namelist.classList.add("d-none");
        blockClick(data.sendto);
    });
}

function stratChatBox(){

    setEmojies();
    const emoji = document.querySelector(".list-emoji");
    const messageInput = document.querySelector("#id_message_send_input");
    const messageSendButton = document.querySelector("#id_message_send_button");
    messageInput.focus();

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
        messageInput.value = "";
        if (message.trim() != "") {
            if (emoji)
                emoji.classList.add("d-none");
            sendToBackend(currentSendto, "message", message);
        }
    });
}

function chatHeader(data) {

    document.querySelector(".welcome-chat").classList.add("d-none");
    document.querySelector(".loading-chat").classList.remove("d-none");

    const headerImage =  document.querySelector('.main-chat .chat-user-img');
    headerImage.innerHTML = `<img class="avatar" src="${data.avatar}" alt="${data.sendto}">`;

    const headerImageContent =  document.querySelector('.main-chat .chat-user-content');
    headerImageContent.innerHTML = ` <h5>${data.sendto}</h5> <p>${data.status}</p>`;

    document.querySelector(".main-chat .expand-left").addEventListener('click', () => {
        CloseMainChat();
    })
    addEventListenerChatObtions(data);
}

function createMessageElement(message) {

    const div = document.createElement("div");
    if (message.username === user) div.classList.add("message", "sent");
    else div.classList.add("message", "received");
    div.setAttribute("dir", "auto");
    div.innerHTML = `${message.message}`;

    const span = document.createElement("span");
    span.classList.add("chat-time-message");
    span.textContent = message.time;
    if (message.username === user) span.classList.add("right");
    else span.classList.add("left");
    div.appendChild(span);
    return div;
}

function createEndOfConv(data){
    const div = document.createElement("div");
    div.classList.add("chat-profile");
    div.innerHTML = `<div><img class="avatar-chat-profile" src="${data.avatar}" alt="${data.sendto}"></div>
        <div class="chat-profile-content"> <h5>${data.sendto}</h5></div>`;
    return div;
}

// ------------ Typing ------------

function stopTyping(data){
    document.querySelectorAll(".chat-list .chat-user-card .chat-user-content").forEach(user => {
        const name = user.querySelector("h5").innerHTML;
        if (name === data.username){
            user.querySelector("p").classList.remove("d-none");
            user.querySelector(".chat-list-typing").classList.add("d-none");
            return;
        }
    });
    var typing = document.querySelector(".chat-typing");
    if (typing)
        typing.remove();
}

function startTyping(data){
    const room = document.querySelector(".chat-card-active .chat-user-content h5");
    if (room == null || room.innerHTML != data.username){
        creatTypingInList(data.username);
        return;
    }
    const container = document.querySelector("#id_chat_item_container");
    if (!document.querySelector(".chat-typing"))
        container.prepend(createTypingDiv());
}

function creatTypingInList(username){
    document.querySelectorAll(".chat-list .chat-user-card .chat-user-content").forEach(user => {
        const name = user.querySelector("h5").innerHTML;
        if (name === username){
            user.querySelector("p").classList.add("d-none");
            user.querySelector(".chat-list-typing").classList.remove("d-none");
            return;
        }
    });
}

function createTypingDiv(){
    const div = document.createElement('div');
    div.classList.add("chat-typing");
    div.innerHTML = `
        <div class="chat-dote-typing"></div>
        <div class="chat-dote-typing"></div>
        <div class="chat-dote-typing"></div>
    `;
    return (div);
}

export {
    stratChatBox,
    removeScroll,
    loadMoreContent,
    showAllMessages,
    startTyping,
    stopTyping,
    chatHeader,
    receiveMessage,
    respondMessage,
    updatestatuUsers,
}