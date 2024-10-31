import {setCurrentSendTo, currentSendto, dataListFriends, dataListUsers} from "./socket.js"
import {removeScroll} from "./scrollHandler.js"
import {sendToBackend} from "../script.js"

// ------------------ Chat/Friends List ------------------
function activeBtn(activebtn, btn, displayContent, hideContent, cardClass){

    activebtn.classList.add("chat-active");
    document.querySelector(btn).classList.remove("chat-active");

    document.querySelector(displayContent).classList.remove("d-none");
    const headen = document.querySelector(hideContent);
    headen.classList.add("d-none");
    headen.querySelectorAll(cardClass).forEach(card => {card.classList.remove("chat-card-active")})
}

function friendMessagBtn(){
    document.querySelectorAll(".chat-nav-sidebar .chat-btn").forEach(btn => {
        btn.addEventListener('click', function() {
    
            document.querySelector(".main-chat").classList.add("d-none");
            document.querySelector(".welcome-chat").classList.remove("d-none");

            if (btn.innerHTML == "Friends") activeBtn(btn, ".chat-msg-btn", ".friend-chat", ".chat-list", ".chat-user-card");
            else activeBtn(btn, ".chat-friend-btn", ".chat-list", ".friend-chat", ".chat-friend-card");
        });
    });
}

function handleChatResise() {
    if (window.innerWidth <= 992) {
        var chatUsersList = document.querySelector(".chat-sidebar");
        var mainChat = document.querySelector(".main-chat");
        chatUsersList.style.zIndex = "0";
        mainChat.removeAttribute('style');
    }
}

function userCard(classes, activeClass) {
    document.querySelectorAll(classes).forEach((card, index) => {
        card.addEventListener('click', function() {

            if (classes === ".friend-chat .chat-friend-card")
                setCurrentSendTo(dataListFriends[index].username);
            else
                setCurrentSendTo(dataListUsers[index].username);
            
            document.querySelector(".welcome-chat").classList.add("d-none");
            handleChatResise();
            
            const activeChat = document.querySelector(activeClass);
            if (activeChat)
                activeChat.classList.remove("chat-card-active");
            this.classList.add('chat-card-active');

            const notif = this.querySelector(".chat-notification");
            if (notif) {
                notif.innerHTML = 0;
                notif.classList.add("d-none");
            }
            
            document.querySelector(".loading-chat").classList.remove("d-none");
            document.querySelector(".main-chat").classList.add("d-none");
            
            removeScroll();
            document.querySelector('#id_chat_item_container').innerHTML = "";
            sendToBackend(currentSendto, "showConversation", "");
        });
    });
}

function creatUserCard(listuser){
    const div = document.createElement("div");
    div.classList.add("chat-user-card");
    div.innerHTML =`
        <div class="chat-user-img">
            <img class="avatar" src="${listuser.avatar}">
            <span class="chat-user-status"></span>
        </div>
        <div class="chat-user-content">
            <h5>${listuser.username}</h5>
            <p>${listuser.lastMessage}</p>
            <div class="chat-list-typing d-none">
                <div class="chat-list-dote-typing"></div>
                <div class="chat-list-dote-typing"></div>
                <div class="chat-list-dote-typing"></div>
            </div>
        </div>
        <span class="chat-notification">${listuser.notifications}</span>
    `;
    if (listuser.notifications == 0){
        div.querySelector(".chat-notification").classList.add("d-none");
    }
    const statusSpan = div.querySelector('.chat-user-status');
    statusSpan.classList.remove('Online', 'Offline');
    statusSpan.classList.add(listuser.status);
    return div
}

function creatFriendCard(listuser){
    const div = document.createElement("div");
    div.classList.add("chat-friend-card");
    div.innerHTML =`
        <div class="chat-user-img">
        <img class="avatar" src="${listuser.avatar}">
        </div>
        <div class="chat-user-content">
        <h5>${listuser.username}</h5>
        </div>
    `;
    return div
}

function showUsers(data) {

    const container = document.querySelector(".chat-list");
    container.innerHTML = "";

    if (data.listUsers.length == 0){
        const div = document.createElement("div");
        div.classList.add("chat-friend-empty");
        div.innerHTML = `
            <img src="pages/Chat/icons/new/Empty-mesages.png" alt="no-conversations">
            <h5>No Conversations Yet</h5>
        `;
        container.appendChild(div);
    }
    else {
        data.listUsers.forEach(listuser => container.appendChild(creatUserCard(listuser)));
        var sendto = document.querySelector(".chat-header .chat-user-content h5");
        if (sendto) {
            document.querySelectorAll(".chat-list .chat-user-card").forEach(card => {
                var username = card.querySelector(".chat-user-content h5");
                if (sendto.innerHTML === username.innerHTML) card.classList.add("chat-card-active");
            })
        }
    }
    
    friendMessagBtn();
    document.querySelector(".chat-sidebar .loading-chat-list").classList.add("d-none");
    const messageBtn = document.querySelector(".chat-msg-btn");
    activeBtn(messageBtn, ".chat-friend-btn", ".chat-list", ".friend-chat", ".chat-friend-card");
    userCard(".chat-list .chat-user-card", ".chat-list .chat-card-active");
}

function showFriends(data){

    const container = document.querySelector(".friend-chat");
    container.innerHTML = '';
    
    if (data.listFriends.length == 0){
        const div = document.createElement("div");
        div.classList.add("chat-friend-empty");
        div.innerHTML = `
            <img src="pages/Chat/icons/new/Empty-friends.png" alt="no-friends">
            <h5>No Friends Right Now</h5>
        `;
        container.appendChild(div);
    }
    else 
        data.listFriends.forEach(listfriend => container.appendChild(creatFriendCard(listfriend)));
    userCard(".friend-chat .chat-friend-card", ".friend-chat .chat-card-active");
}

export {
    showFriends,
    showUsers,
    activeBtn,
    handleChatResise,
    creatFriendCard,
}