import {setnotifUser} from "./socket.js"
import {sendToBackend} from "../script.js"
import { debounce } from "../../../utils/js/utils.js";

function startSearchAndNotif(){
    
    // --------------- Search Button ---------------
    const searchButton = document.querySelector(".nav-buttons .search");
    const searchOverlay = document.querySelector(".search-overlay");
    const searchDiv = document.querySelector(".search-div");
    
    const searchInput = document.querySelector("#search-input");
    searchInput.focus();
    
    const debouncedSendValue = debounce(sendValue, 1000);
    
    searchInput.onkeyup = function () {
        debouncedSendValue();
    }

    searchButton.addEventListener('click', (event) => {
        event.stopPropagation();
        searchOverlay.classList.remove("d-none");
    });
    
    searchDiv.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    searchOverlay.addEventListener('click', (event) => {
        event.stopPropagation();
        searchDiv.querySelector(".search-content").innerHTML = "";
        searchInput.value = "";
        searchOverlay.classList.add("d-none");
    });
    
    // --------------- Notification Button ---------------
    const notificationButton = document.querySelector(".nav-buttons .notification");
    const listnotification = document.querySelector(".show-notification");

    notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        listnotification.classList.remove("d-none");
    });
    
    listnotification.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    
    document.body.addEventListener('click', () => {
        if (listnotification.classList.contains("d-none"))
            return;
        listnotification.classList.add("d-none");
    });
}

// ------------- functions General -------------

function sendValue() {
    const searchInput = document.querySelector("#search-input");
    const value = searchInput.value;
    if (value.trim() != "")
        sendToBackend("", "searchHome", searchInput.value);
}

// --------------- Upadate Home ---------------

function creatonlineUsers(listuser){
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML =`<img class="avatar" src="${listuser.avatar}" alt="${listuser.user}" user="${listuser.user}">`;

    // div.addEventListener('click', function() {  
    //     const hash = `#profile/${listuser.id}`;
    //     const id = listuser.id;
    //     const state = { id };
    //     history.pushState(state, '', hash);
    //     loadContentWithProfile(hash, listuser.id);
    // });
    return div
}

function updateHomeUsers(data){

    let userExists = false;
    if (data.status === "Online"){
        document.querySelectorAll(".online-users .user").forEach(user => {
            if (user.querySelector("img").getAttribute("user") === data.username){
                userExists = true;
                return; 
            }
        });
        if (!userExists){
            const container = document.querySelector(".sidebar-content .online");
            container.classList.remove('d-none');
            container.querySelector(".online-users").appendChild(creatonlineUsers(data.listuser));
        }
    }
    else
        removeOnlineFriend(data.username);
}

function onlineFriendsHome(data){
    const onlineUsers = document.querySelector(".sidebar-content .online");
    if (data.listFriends.length != 0){
        onlineUsers.classList.remove('d-none');
        var users = onlineUsers.querySelector(".online-users")
        data.listFriends.forEach(listfriend => users.appendChild(creatonlineUsers(listfriend)));
    }
}

function searchHome(data){
    const container = document.querySelector(".search-content");
    container.innerHTML = "";

    let list = data.listsearch;
    if (list.length === 0) {
        const div = document.createElement("div");
        div.classList.add("no-results");
        div.innerHTML = `
            <h1>No results found</h1>
            <p>It seems we can't find any results based on your search.</p>
        `;
        container.appendChild(div);
    }

    list.forEach(user => { 
        const div = document.createElement("div");
        div.classList.add("col-xl-3", "col-lg-4", "col-md-6", "col-sm-6", "p-1");
        div.innerHTML = `
            <div class="user-card tf-card-box style-1">
                <img src="${user.avatar}" alt="${user.username}">
                <h5 class="text-center text-md-start">${user.username}</h5>
            </div>
        `;
        // div.addEventListener('click', () => {
        //     const tmpoverlay = document.querySelector("#overlay");
        //     tmpoverlay.querySelector("#search-input").value = "";
        //     container.innerHTML = "";
        //     tmpoverlay.style.display = "none";
        //     const hash = `#profile/${user.id}`;
        //     const id = user.id;
        //     const state = { id };
        //     history.pushState(state, '', hash);
        //     loadContentWithProfile( hash , user.id);
        // });
        container.appendChild(div);
    });
}

// --------------------------------------------------------------

function checkNotif(){
    const notificationButton = document.querySelector(".notification");
    const listnotification = document.querySelector(".show-notification");

    const container = listnotification.querySelector(".list-notification");
    const notifications = listnotification.getElementsByClassName('notification-user-card');

    const notification = notificationButton.querySelector("span");
    if (notifications.length === 0){
        notification.style.backgroundColor = "";
        const div = document.createElement("div");
        div.classList.add("empty-notifications");
        div.innerHTML = `
            <img src="pages/Chat/icons/tmp/Empty-notification.png" alt="no-notification">
            <h5>No Notifications Yet</h5>
        `;
        container.appendChild(div);
    }
}

function creatNotifReqFriend(data){
    const div = document.createElement("div");
    div.classList.add("notification-user-card", "notifReqFriend");
    div.innerHTML = `
        <div class="notification-user-img">
            <img class="avatar" src=${data.avatar}>
            <img class="notification-user-status" src="pages/Chat/icons/UserAdd.svg"></img>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
            <p>Friend request</p>
        </div>
        <div class="notification-choices">
            <button id="reqConfirm" class="notification-btn badge d-flex align-items-center">
                Confirm
                <img src="pages/Chat/icons/checkOk.svg" alt="OK">
            </button>
            <button id="reqDelete" class="notification-btn badge d-flex align-items-center">
                Delete
                <img src="pages/Chat/icons/checkNo.svg" alt="NO">
            </button>
        </div>`;

    div.querySelector(".notification-choices #reqConfirm").addEventListener('click',() => {
        console.log("Confirm");
        sendToBackend(data.user, "reqConfirm", "");
        reqConfirm(data); // |!!|
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });

    div.querySelector(".notification-choices #reqDelete").addEventListener('click',() => {
        console.log("Delete");
        sendToBackend(data.user, "reqDelete", "");
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });
    return div;
}

function creatNotifReqGame(data){
    const div = document.createElement("div");
    div.classList.add("notification-user-card", "notifReqGame");
    div.innerHTML = `
        <div class="notification-user-img">
            <img class="avatar" src=${data.avatar}>
            <img class="notification-user-status" src="pages/Chat/icons/gameIcon.svg"></img>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
            <p>Game request</p>
        </div>
        <div class="notification-choices">
            <button class="notification-btn badge d-flex align-items-center">
                Accept
                <img src="pages/Chat/icons/checkOk.svg" alt="OK">
            </button>
            <button class="notification-btn badge d-flex align-items-center">
                Decline
                <img src="pages/Chat/icons/checkNo.svg" alt="NO">
            </button>
        </div>
    `
    return div;
}

function creatNotifMessage(data){
    const div = document.createElement("div");
    div.classList.add("notification-user-card", "notifMessage");
    div.innerHTML = `
        <div class="notification-user-img">
            <img class="avatar" src="${data.avatar}">
            <img class="notification-user-status" src="pages/Chat/icons/chatIcon.svg"></img>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
            <p>Message received</p>
        </div>
        <div class="notification-choices">
            <button class="message-notification-btn badge d-flex align-items-center">
                Go to conversation
                <img src="pages/Chat/icons/goToconvIcon.svg" alt="/go-to-conversation">
            </button>
        </div>
    `;
    div.querySelector(".message-notification-btn").addEventListener('click', function() {
        window.location.hash = '#chat';
        setnotifUser(data.user);
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });
    return div;
}

function homeNotification(data){
    const listnotification = document.querySelector(".show-notification");
    const notification = document.querySelector(".notification span");
    const container = listnotification.querySelector(".list-notification");

    if (data.notification != 0){
        notification.style.backgroundColor = "#E51284";
        data.chatNotification.forEach(user => {
            container.prepend(creatNotifMessage(user));
        })
        data.ReqNotification.forEach(user => {
            container.prepend(creatNotifReqFriend(user));
        })
    }
    else {
        const div = document.createElement("div");
        div.classList.add("empty-notifications");
        div.innerHTML = `
            <img src="pages/Chat/icons/tmp/Empty-notification.png" alt="no-notification">
            <h5>No Notifications Yet</h5>
        `;
        container.appendChild(div)
    }
}

function creatNotification(data, classes, myfunction){
    const container = document.querySelector(".show-notification .list-notification");
    const user = data.notificationlist.user;

    container.querySelectorAll(classes).forEach(card => {
        const tmpUser = card.querySelector("h5").innerHTML;
        if (tmpUser === user)
            card.parentElement.remove();
    })
    container.prepend(myfunction(data.notificationlist));
}

function updateHomeNotification(data){
    document.querySelector(".notification span").style.backgroundColor = "#E51284";

    let empty = document.querySelector(".show-notification .empty-notifications");
    if (empty)
        empty.remove();

    if (data.type === "CreatNotifChat")
        creatNotification(data, ".notifMessage .notification-user-content", creatNotifMessage)

    if (data.type == "ToPlayPingPong")
        creatNotification(data, ".notifReqGame .notification-user-content", creatNotifReqGame);

    if (data.type == "friendRequest")
        creatNotification(data, ".notifReqFriend .notification-user-content", creatNotifReqFriend);

}

// -------------------- Warning -------------------

function removeNotif(friend, myclass){
    document.querySelectorAll(myclass).forEach(notif => {
        const username = notif.querySelector(".notification-user-content h5").innerHTML;
        if (username === friend){
            notif.remove();
            checkNotif();
            return;
        }
    });
}

function removeOnlineFriend(friend){

    const users = document.querySelector(".online-users");
    var len = users.querySelectorAll(".user").length;
    console.log(users);
    users.querySelectorAll(".user").forEach(user => {
        const username = user.querySelector("img").getAttribute("user");
        console.log(username, friend);
        if (username === friend){
            if (len == 1)
                users.parentElement.classList.add("d-none");
            user.remove();
        }
    });
}

function closeWarning(){
    const warning = document.querySelector(".chat-warning");
    warning.remove();
}

function friendBlockedYou(data){
    if (document.querySelector("#chat-content")){
        const div = document.createElement("div");
        div.classList.add("chat-warning");
        div.innerHTML = `
                <div class="chat-warning-div">
                    <p class="chat-warning-content">
                        Your Friendship with 
                        <span>${data.username}</span> 
                        is no longer available as they have blocked you.
                    </p>
                    <button id="warningDismiss" class="chat-warning-button">Dismiss</button>
                </div>
            `;
        document.querySelector(".chat-container").appendChild(div);
        document.querySelector(".main-chat").classList.add("d-none");
        document.querySelector(".welcome-chat").classList.remove("d-none");

        div.querySelector(".chat-warning #warningDismiss").addEventListener('click', () => {
            closeWarning();
        })
        sendToBackend("", "showUsersFriend", "");
    }
    removeOnlineFriend(data.username);
    removeNotif(data.username, ".notification-user-card");
}

function blockClick(friend){

    const div = document.createElement("div");
    div.classList.add("chat-warning");
    div.innerHTML = `
        <div class="chat-warning-div">
            <p class="chat-warning-content">
                You are about to block <span>${friend}</span>.</br>
                Are you sure?
            </p>
            <div class="chat-block-warning">
                <button id="warningCancel" class="chat-warning-button">Cancel</button>
                <button id="chat-button-Block" class="chat-warning-button">Block</button>
            </div>
        </div>`;
    document.querySelector(".content").append(div);

    div.querySelector(".chat-warning #warningCancel").addEventListener('click', () => {
        closeWarning();
    })
    document.querySelector(".chat-warning #chat-button-Block").addEventListener('click', () => {
        sendToBackend(friend, "blockUser", "");
        if (document.querySelector("#chat-content")){
            document.querySelector(".main-chat").classList.add("d-none");
            document.querySelector(".welcome-chat").classList.remove("d-none");
            sendToBackend("", "showUsersFriend", "");
        }
        else
            window.location.hash = '#home';
        removeOnlineFriend(friend);
        removeNotif(friend, ".notification-user-card");
        closeWarning();
    });
}

// ----------------- Add Friendship ------------------

function addFrindship(friend){
    sendToBackend(friend, "addFrindship", "");
}

function reqConfirm(data){
    console.log(data);
    console.log(data.user, "accept u");

    if (data.status == "Online") {
        const users = document.querySelector(".users");
        users.classList.remove('d-none');
        users.appendChild(creatonlineUsers(data));
    }
    if (document.querySelector("#chat-content")){
        const container = document.querySelector(".friend-chat");
        var empty = container.querySelector(".chat-friend-empty");
        console.log(empty)
        if (empty) empty.remove();
        container.appendChild(creatFriendCard(data));
    }
}

function reqDelete(data){
    console.log(data.username, "refuse ur req")   
}

export {
    startSearchAndNotif,
    blockClick,
    friendBlockedYou,
    updateHomeNotification,
    homeNotification,
    searchHome,
    onlineFriendsHome,
    updateHomeUsers,
    removeNotif,
}