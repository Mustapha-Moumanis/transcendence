import {user, currentSendto} from "./socket.js"
import {activeBtn} from "./listchat.js"
import {smoothScrollToBottom} from "./scrollHandler.js"
import {blockClick} from "./homeSocket.js"
import {sendToBackend} from "../script.js"
import {setEmojies} from "./emoji.js"
import { debounce } from "../../../utils/js/utils.js"

// ------------------ Upadate chat------------------

function updateNotification(data){
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

function updatestatuUsers(data){

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

function addEventListenerChatObtions(data){

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
        var emoji = document.querySelector(".list-emoji");
        messageInput.value = "";
        if (message.trim() != "") {
            if (emoji)
                emoji.classList.add("d-none");
            sendToBackend(currentSendto, "message", message);
        }
    });
}

function chatHeader(data) {

    stratChatBox();
    // This part for hiding the welcome state & displaying loading.
    document.querySelector(".welcome-chat").classList.add("d-none");
    document.querySelector(".loading-chat").classList.remove("d-none");

    const header =  document.querySelector('.chat-header');
    header.innerHTML = `
        <svg class="expand-left" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.293 5.29297L15.7073 6.70718L10.4144 12.0001L15.7073 17.293L14.293 18.7072L7.58594 12.0001L14.293 5.29297Z"/>
        </svg>
        <div class="chat-user-img">
            <img class="avatar" src="${data.avatar}" alt="${data.sendto}">
        </div>
        <div class="chat-user-content">
            <h5>${data.sendto}</h5>
            <p>${data.status}</p>
        </div>
        <div class="chat-options">
            <svg id="id_chat-options" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M20 9C20.5523 9 21 9.44772 21 10L21 30C21 30.5523 20.5523 31 20 31C19.4477 31 19 30.5523 19 30L19 10C19 9.44772 19.4477 9 20 9Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M31 20C31 20.5523 30.5523 21 30 21L10 21C9.44772 21 9 20.5523 9 20C9 19.4477 9.44772 19 10 19L30 19C30.5523 19 31 19.4477 31 20Z"/>
            </svg>

            <div class="d-none chat-options-list">
                <div id="chat-show-profile" class="chat-option-element">Show Profile</div>
                <div id="chat-block-friend" class="chat-option-element" style="color: #D31010;">Block Friend</div>
            </div>
        </div>`;
    header.querySelector(".expand-left").addEventListener('click', () => {
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
    div.innerHTML = `
        <div> 
            <img class="avatar-chat-profile" src="${data.avatar}" alt="${data.sendto}">
        </div>
        <div class="chat-profile-content">
            <h5>${data.sendto}</h5>
        </div>
    `;
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
    startTyping,
    stopTyping,
    chatHeader,
    receiveMessage,
    respondMessage,
    updatestatuUsers,
    createEndOfConv,
    createMessageElement,
}