import { setCurrentSendTo, setnotifUser, user } from "./socket.js"
import { sendToBackend } from "../script.js"
import { debounce } from "../../../utils/js/utils.js";

function startSearchAndNotif() {

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

function creatonlineUsers(listuser) {
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML = `<img class="avatar" src="${listuser.avatar}" alt="${listuser.user}" user="${listuser.user}">`;
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
    
    const searchOverlay = document.querySelector(".search-overlay");
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
            searchOverlay.classList.add("d-none");
            window.location.hash = `#profile?id=${user.id}`;
        });
    });
}

// --------------------------------------------------------------

function checkNotif() {
    const notificationButton = document.querySelector(".notification");
    const listnotification = document.querySelector(".show-notification");

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
            <svg class="notification-user-status" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1426 10.2143C10.1426 11.0668 10.4812 11.8844 11.084 12.4872C11.6868 13.09 12.5044 13.4286 13.3569 13.4286C14.2093 13.4286 15.0269 13.09 15.6297 12.4872C16.2325 11.8844 16.5712 11.0668 16.5712 10.2143C16.5712 9.36181 16.2325 8.54424 15.6297 7.94145C15.0269 7.33865 14.2093 7 13.3569 7C12.5044 7 11.6868 7.33865 11.084 7.94145C10.4812 8.54424 10.1426 9.36181 10.1426 10.2143Z" fill="#888888"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5178 15.0358C19.9616 15.0358 20.3214 15.3955 20.3214 15.8393V17.7144H22.1964C22.6402 17.7144 23 18.0741 23 18.5179C23 18.9617 22.6402 19.3215 22.1964 19.3215H20.3214V21.1965C20.3214 21.6403 19.9616 22.0001 19.5178 22.0001C19.0741 22.0001 18.7143 21.6403 18.7143 21.1965V19.3215H16.8393C16.3955 19.3215 16.0357 18.9617 16.0357 18.5179C16.0357 18.0741 16.3955 17.7144 16.8393 17.7144H18.7143V15.8393C18.7143 15.3955 19.0741 15.0358 19.5178 15.0358Z" fill="#C4F000"/>
                <path d="M17.375 16.3136C16.3934 15.2015 14.9572 14.5 13.3572 14.5C10.3985 14.5 8 16.8985 8 19.8572C8 20.153 8.23985 20.3929 8.53572 20.3929H15.8011C15.1423 20.0274 14.6965 19.3247 14.6965 18.5179C14.6965 17.3344 15.6559 16.375 16.8393 16.375H17.375V16.3136Z" fill="#888888"/>
            </svg>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
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
        console.log("Confirm");
        sendToBackend(data.user, "reqConfirm", "");
        reqConfirm(data);
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });

    div.querySelector(".notification-choices #reqDelete").addEventListener('click', () => {
        console.log("Delete");
        sendToBackend(data.user, "reqDelete", "");
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });
    return div;
}

function SendMessage(username) {
    window.location.hash = '#chat';
    setnotifUser(username);
}

function creatNotifMessage(data) {
    const div = document.createElement("div");
    div.classList.add("notification-user-card", "notifMessage");
    div.innerHTML = `
        <div class="notification-user-img">
            <img class="avatar" src="${data.avatar}">
            <svg class="notification-user-status" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12C0 5.37258 5.37258 0 12 0H25V13C25 19.6274 19.6274 25 13 25H0V12Z" fill="#070707"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7408 8C14.453 8 13.057 8.11365 11.7937 8.25681C10.7049 8.3802 9.85161 9.24254 9.73276 10.3294C9.5955 11.5845 9.48153 12.9789 9.48153 14.2593C9.48153 15.2922 9.55571 16.4002 9.65625 17.4481L9.011 20.4163C8.97584 20.5779 9.02622 20.7465 9.1444 20.8623C9.26258 20.9782 9.432 21.0252 9.59301 20.9869L12.3669 20.3265C13.4704 20.4378 14.6446 20.5185 15.7408 20.5185C17.0281 20.5185 18.4248 20.4072 19.689 20.2654C20.7784 20.1431 21.6319 19.2804 21.7502 18.1933C21.8869 16.9366 22 15.5397 22 14.2593C22 12.9791 21.8869 11.5848 21.7503 10.3296C21.6319 9.24257 20.7784 8.38019 19.6896 8.25685C18.4257 8.11367 17.0286 8 15.7408 8Z" fill="#888888"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3935 12.4537C13.0611 12.4537 12.7916 12.7232 12.7916 13.0556C12.7916 13.388 13.0611 13.6574 13.3935 13.6574H18.0879C18.4204 13.6574 18.6898 13.388 18.6898 13.0556C18.6898 12.7232 18.4204 12.4537 18.0879 12.4537H13.3935ZM13.3935 15.3426C13.0611 15.3426 12.7916 15.6121 12.7916 15.9445C12.7916 16.2769 13.0611 16.5463 13.3935 16.5463H16.9444C17.2768 16.5463 17.5463 16.2769 17.5463 15.9445C17.5463 15.6121 17.2768 15.3426 16.9444 15.3426H13.3935Z" fill="#C4F000"/>
            </svg>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
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
        SendMessage(data.user);
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
    });
    return div;
}

function homeNotification(data) {
    // add username to sidebar:
    let welcome = document.querySelector(".welcome h5");
    welcome.innerHTML = `Welcome ${user}`;

    const listnotification = document.querySelector(".show-notification");
    const notification = document.querySelector(".notification span");
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
    const user = data.notificationlist.user;

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
    console.log(users);
    users.querySelectorAll(".user").forEach(user => {
        const username = user.querySelector("img").getAttribute("user");
        console.log(username, friend);
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

function addFrindship(friend) {
    sendToBackend(friend, "addFrindship", "");
}

function reqConfirm(data) {

    if (data.status == "Online") {
        const onlineUsers = document.querySelector(".sidebar-content .online");
        onlineUsers.classList.remove('d-none');
        onlineUsers.querySelector(".online-users").appendChild(creatonlineUsers(data))
    }
    if (document.querySelector("#chat-content")) {
        const friendList = document.querySelector(".friend-chat");
        let emptylist = friendList.querySelector(".chat-friend-empty");
        if (emptylist) emptylist.remove();
        friendList.appendChild(creatFriendCard(data));
    }
}

function reqDelete(data) {
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
    SendMessage,
    reqDelete,
    reqConfirm,
}