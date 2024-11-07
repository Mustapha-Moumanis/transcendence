import { setCurrentSendTo, setnotifUser, user } from "./socket.js"
import { sendToBackend } from "../script.js"
import { debounce } from "../../../utils/js/utils.js";
import { creatFriendCard } from "./listchat.js";
import { profileBtnState } from "../../Profile/script.js";

function startSearchAndNotif() {
    
    const listnotification = document.querySelector(".show-notification");
    const notificationButton = document.querySelector(".nav-buttons .notification");
    const searchOverlay = document.querySelector(".search-overlay");
    const searchInput = document.querySelector("#search-input");
    const searchDiv = document.querySelector(".search-div");

    // --------------- Search Button ---------------
    const searchButton = document.querySelector(".nav-buttons .search");
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

function creatonlineUsers(listuser) {
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML = `<img class="avatar" src="${listuser.avatar}" alt="${listuser.username}" user="${listuser.username}">`;
    return div
}

function updateHomeUsers(data) {

    let userExists = false;
    if (data.status === "Online") {
        document.querySelectorAll(".online-users .user").forEach(user => {
            if (user.querySelector("img").getAttribute("user") === data.username) {
                userExists = true;
                return;
            }
        });
        if (!userExists) {
            const onlineList = document.querySelector(".sidebar-content .online");
            onlineList.classList.remove('d-none');
            onlineList.querySelector(".online-users").appendChild(creatonlineUsers(data.listuser));
        }
    }
    else
        removeOnlineFriend(data.username);
}

function onlineFriendsHome(data) {
    const onlineUsers = document.querySelector(".sidebar-content .online");
    if (data.listFriends.length != 0) {
        onlineUsers.classList.remove('d-none');
        var users = onlineUsers.querySelector(".online-users")
        data.listFriends.forEach(listfriend => users.appendChild(creatonlineUsers(listfriend)));
    }
}

function searchHome(data) {

    const searchOverlay = document.querySelector(".search-overlay");
    const searchDiv = document.querySelector(".search-div");
    const searchInput = document.querySelector("#search-input");
    const searchContent = document.querySelector(".search-content");
    searchContent.innerHTML = "";

    let list = data.listsearch;
    if (list.length === 0) {
        const div = document.createElement("div");
        div.classList.add("no-results");
        div.innerHTML = `
            <h1>No results found</h1>
            <p>It seems we can't find any results based on your search.</p>
        `;
        searchContent.appendChild(div);
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
        searchContent.appendChild(div);
        div.querySelector(".user-card").addEventListener('click', () => {
            searchInput.value = "";
            searchDiv.querySelector(".search-content").innerHTML = "";
            searchOverlay.classList.add("d-none");
            window.location.hash = `#profile?id=${user.id}`;
        });
    });
}

// --------------------------------------------------------------

function SendMessage(username) {
    window.location.hash = '#chat';
    setnotifUser(username);
}

function checkNotif() {

    const listnotification = document.querySelector(".show-notification");
    const notificationButton = document.querySelector(".nav-buttons .notification");
    const containerNotif = listnotification.querySelector(".list-notification");
    const notifications = listnotification.getElementsByClassName('notification-user-card');

    const notification = notificationButton.querySelector("span");
    if (notifications.length === 0) {
        notification.style.backgroundColor = "";
        const div = document.createElement("div");
        div.classList.add("empty-notifications");
        div.innerHTML = `
            <img src="pages/Chat/icons/new/Empty-notification.png" alt="no-notification">
            <h5>No Notifications Yet</h5>
        `;
        containerNotif.appendChild(div);
    }
}

function creatNotifReqFriend(data) {
    const div = document.createElement("div");
    div.classList.add("notification-user-card", "notifReqFriend");
    div.innerHTML = `
        <div class="notification-user-img">
            <img class="avatar" src=${data.avatar}>
        </div>
        <div class="notification-user-content">
            <h5>${data.username}</h5>
            <p>Friend request</p>
        </div>
        <div class="notification-choices">
            <button id="reqConfirm" class="btn notification-btn badge d-flex align-items-center">
                Confirm
                <img src="pages/Chat/icons/checkOk.svg" alt="OK">
            </button>
            <button id="reqDelete" class="btn notification-btn badge d-flex align-items-center">
                Delete
                <img src="pages/Chat/icons/checkNo.svg" alt="NO">
            </button>
        </div>`;

    div.querySelector(".notification-choices #reqConfirm").addEventListener('click', () => {
        sendToBackend(data.username, "reqConfirm", "");
        reqConfirm(data);
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });

    div.querySelector(".notification-choices #reqDelete").addEventListener('click', () => {
        sendToBackend(data.username, "reqDelete", "");
        profileBtnState("follow", "add_friend", "Add Friend", data);
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });

    profileBtnState("follow", "request_received", "Confirm Request", data);
    return div;
}

function creatNotifMessage(data) {
    const div = document.createElement("div");
    div.classList.add("notification-user-card", "notifMessage");
    div.innerHTML = `
        <div class="notification-user-img">
            <img class="avatar" src="${data.avatar}">
        </div>
        <div class="notification-user-content">
            <h5>${data.username}</h5>
            <p>Message received</p>
        </div>
        <div class="notification-choices">
            <button class="btn message-notification-btn badge d-flex align-items-center">
                Go to conversation
                <img src="pages/Chat/icons/goToconvIcon.svg" alt="/go-to-conversation">
            </button>
        </div>
    `;
    div.querySelector(".message-notification-btn").addEventListener('click', function () {
        SendMessage(data.username);
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });
    return div;
}

function homeNotification(data) {

    const notification = document.querySelector(".notification span");
    const listnotification = document.querySelector(".show-notification");
    const containerNotif = listnotification.querySelector(".list-notification");

    if (data.notification != 0) {
        notification.style.backgroundColor = "#E51284";
        data.chatNotification.forEach(user => {
            containerNotif.prepend(creatNotifMessage(user));
        })
        data.ReqNotification.forEach(user => {
            containerNotif.prepend(creatNotifReqFriend(user));
        })
    }
    else {
        const div = document.createElement("div");
        div.classList.add("empty-notifications");
        div.innerHTML = `
            <img src="pages/Chat/icons/new/Empty-notification.png" alt="no-notification">
            <h5>No Notifications Yet</h5>
        `;
        containerNotif.appendChild(div)
    }
}

function creatNotification(data, classes, myfunction) {
    const listNotif = document.querySelector(".show-notification .list-notification");
    const user = data.notificationlist.username;

    listNotif.querySelectorAll(classes).forEach(card => {
        const tmpUser = card.querySelector("h5").innerHTML;
        if (tmpUser === user)
            card.parentElement.remove();
    })
    listNotif.prepend(myfunction(data.notificationlist));
}

function updateHomeNotification(data) {
    document.querySelector(".notification span").style.backgroundColor = "#E51284";

    let empty = document.querySelector(".show-notification .empty-notifications");
    if (empty)
        empty.remove();

    if (data.type === "CreatNotifChat")
        creatNotification(data, ".notifMessage .notification-user-content", creatNotifMessage)

    if (data.type == "friendRequest")
        creatNotification(data, ".notifReqFriend .notification-user-content", creatNotifReqFriend);

}

// -------------------- Warning -------------------

function removeNotif(friend, myclass) {
    document.querySelectorAll(myclass).forEach(notif => {
        const username = notif.querySelector(".notification-user-content h5").innerHTML;
        if (username === friend) {
            notif.remove();
            checkNotif();
            return;
        }
    });
}

function removeOnlineFriend(friend) {

    const users = document.querySelector(".online-users");
    var len = users.querySelectorAll(".user").length;
    users.querySelectorAll(".user").forEach(user => {
        const username = user.querySelector("img").getAttribute("user");
        if (username === friend) {
            if (len == 1)
                users.parentElement.classList.add("d-none");
            user.remove();
        }
    });
}

function closeWarning() {
    const warning = document.querySelector(".chat-warning");
    warning.remove();
}

function friendBlockedYou(data) {
    if (document.querySelector("#chat-content")) {
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
    profileBtnState("block", "", "", data);
    removeOnlineFriend(data.username);
    removeNotif(data.username, ".notification-user-card");
}

function blockClick(friend) {

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
        if (document.querySelector("#chat-content")) {
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

function reqConfirm(data) {

    if (data.status == "Online") {
        const onlineUsers = document.querySelector(".sidebar-content .online");
        onlineUsers.classList.remove('d-none');
        onlineUsers.querySelector(".online-users").appendChild(creatonlineUsers(data))
    }

    profileBtnState("follow", "message", "Send Message", data);
    removeNotif(data.username,".notification-user-card");

    if (document.querySelector("#chat-content")) {
        const friendList = document.querySelector(".friend-chat");
        let emptylist = friendList.querySelector(".chat-friend-empty");
        if (emptylist) emptylist.remove();
        friendList.appendChild(creatFriendCard(data));
        sendToBackend("", "showUsersFriend", "");
    }
}

function reqDelete(data) {
    profileBtnState("follow", "add_friend", "Add Friend", data);
    removeNotif(data.username, ".notification-user-card");
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
    SendMessage,
    reqDelete,
    reqConfirm,
}