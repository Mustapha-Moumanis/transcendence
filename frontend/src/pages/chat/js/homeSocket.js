function startSearchAndNotif(){
    
    const notificationButton = document.querySelector(".notification li");
    const listnotification = document.querySelector(".show-notification");

    const searchInput = document.querySelector("#search-input");
    searchInput.focus();
    
    const debouncedSendValue = debounce(sendValue, 1000);
    
    searchInput.onkeyup = function () {
        debouncedSendValue();
    }
    
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

function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function sendValue() {
    const searchInput = document.querySelector("#search-input");
    const value = searchInput.value;
    if (value.trim() != "")
        sendToBackend("", "searchHome",searchInput.value);
}

// --------------- Upadate Home ---------------

function creatonlineUsers(listuser){
    const li = document.createElement("li");
    li.innerHTML =`
        <a>
            <i> <img src="${listuser.avatar}" alt="${listuser.user}"> </i>
            <span>${listuser.user}</span>
        </a>
    `;
    li.addEventListener('click', function() {  
        const hash = `#profile/${listuser.id}`;
        const id = listuser.id;
        const state = { id };
        history.pushState(state, '', hash);
        loadContentWithProfile(hash, listuser.id);
    });
    return li
}

function updateHomeUsers(data){

    let userExists = false;
    if (data.status === "Online"){
        document.querySelectorAll(".users li").forEach(user => {
            if (user.querySelector("span").innerHTML === data.username){
                userExists = true;
                return; 
            }
        });
        if (!userExists){
            const container = document.querySelector(".users");
            container.classList.remove('d-none');
            container.appendChild(creatonlineUsers(data.listuser));
        }
    }
    else
        removeOnlineFriend(data.username);
}

function onlineFriendsHome(data){
    const users = document.querySelector(".users");
    if (data.listFriends.length != 0){
        users.classList.remove('d-none');
        data.listFriends.forEach(listfriend => users.appendChild(creatonlineUsers(listfriend)));
    }
}

function searchHome(data){
    const container = document.querySelector(".search-body");
    container.innerHTML = "";

    list = data["listsearch"]
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
        div.classList.add("member");
        div.innerHTML = `
            <img src="${user.avatar}" class="card-img-top search-pr" id="search--pr" alt="${user.username}">
            <div class="card-body1 text-center">
                <h5 class="card-title">${user.username}</h5>
                <div class="progress-info">
                    <span class="card-text-left">LVL 8</span>
                    <span class="card-text-right">75%</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        `;
        div.addEventListener('click', () => {
            const tmpoverlay = document.querySelector("#overlay");
            tmpoverlay.querySelector("#search-input").value = "";
            container.innerHTML = "";
            tmpoverlay.style.display = "none";
            const hash = `#profile/${user.id}`;
            const id = user.id;
            const state = { id };
            history.pushState(state, '', hash);
            loadContentWithProfile( hash , user.id);
        });
        container.appendChild(div);
    });
}

window.addEventListener('popstate', (event) => {
    if (event.state) {
        loadContentWithProfile(location.hash, event.state.id);
    } 
  
});

// --------------------------------------------------------------

function checkNotif(){
    const notificationButton = document.querySelector(".notification li");
    const listnotification = document.querySelector(".show-notification");

    const container = listnotification.querySelector(".list-notification");
    const notifications = listnotification.getElementsByClassName('notification-user-card');

    const notification = notificationButton.querySelector("span");
    if (notifications.length === 0){
        notification.style.backgroundColor = "#ABADC7";
        const div = document.createElement("div");
        div.classList.add("empty-notifications");
        div.innerHTML = `
            <img src="chat/icons/EmptyNotification.png" alt="no-notifacation">
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
            <img class="notification-user-status" src="chat/icons/UserAdd.svg"></img>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
            <p>Friend request</p>
        </div>
        <div class="notification-choices">
            <button id="reqConfirm" class="notification-btn badge d-flex align-items-center">
                Confirm
                <img src="chat/icons/checkOk.svg" alt="OK">
            </button>
            <button id="reqDelete" class="notification-btn badge d-flex align-items-center">
                Delete
                <img src="chat/icons/checkNo.svg" alt="NO">
            </button>
        </div>`;

    div.querySelector(".notification-choices #reqConfirm").addEventListener('click',() => {
        console.log("Confirm");
        sendToBackend(data.user, "reqConfirm", "");
        reqConfirm(data);// |!!|
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
            <img class="notification-user-status" src="chat/icons/gameIcon.svg"></img>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
            <p>Game request</p>
        </div>
        <div class="notification-choices">
            <button class="notification-btn badge d-flex align-items-center">
                Accept
                <img src="chat/icons/checkOk.svg" alt="OK">
            </button>
            <button class="notification-btn badge d-flex align-items-center">
                Decline
                <img src="chat/icons/checkNo.svg" alt="NO">
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
            <img class="notification-user-status" src="chat/icons/chatIcon.svg"></img>
        </div>
        <div class="notification-user-content">
            <h5>${data.user}</h5>
            <p>Message received</p>
        </div>
        <div class="notification-choices">
            <button class="message-notification-btn badge d-flex align-items-center">
                Go to conversation
                <img src="chat/icons/goToconvIcon.svg" alt="/go-to-conversation">
            </button>
        </div>
    `;
    div.querySelector(".message-notification-btn").addEventListener('click', function() {
        loadContentInDiv("#chat");

        document.querySelectorAll(".chat").forEach(element => {
            setActive(element);
        });
        
        document.querySelector(".show-notification").classList.add("d-none");
        div.remove();
        checkNotif();
        notifUser = data.user;
    });
    return div;
}

function homeNotification(data){
    const listnotification = document.querySelector(".show-notification");
    const notification = document.querySelector(".notification li span");
    const container = listnotification.querySelector(".list-notification");

    if (data.notification != 0){
        console.log(data.chatNotification)
        console.log(data.ReqNotification)

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
            <img src="chat/icons/EmptyNotification.png" alt="no-notifacation">
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
    document.querySelector(".notification li span").style.backgroundColor = "#E51284";

    empty = document.querySelector(".show-notification .empty-notifications");
    if (empty)
        empty.remove();

    if (data.type === "CreatNotifChat")
        creatNotification(data, ".notifMessage .notification-user-content", creatNotifMessage)

    if (data.type == "ToPlayPingPong")
        creatNotification(data, ".notifReqGame .notification-user-content", creatNotifReqGame);

    console.log(data);
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
    const users = document.querySelector(".users");
    
    var len = users.querySelectorAll("li").length;
    users.querySelectorAll("li").forEach(user => {
        const username = user.querySelector("span").innerHTML;
        if (username === friend){
            if (len == 1)
                users.classList.add("d-none");
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
                    <button class="chat-warning-button" onclick="closeWarning()">Dismiss</button>
                </div>
            `;
        document.querySelector(".chat-container").appendChild(div);
        document.querySelector(".main-chat").classList.add("d-none");
        document.querySelector(".welcome-chat").classList.remove("d-none");
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
                <button class="chat-warning-button" onclick="closeWarning()">Cancel</button>
                <button id="chat-button-Block" class="chat-warning-button">Block</button>
            </div>
        </div>`;
    document.querySelector(".main--content").append(div);

    document.querySelector(".chat-warning #chat-button-Block").addEventListener('click', () => {
        sendToBackend(friend, "blockUser", "");
        if (document.querySelector("#chat-content")){
            document.querySelector(".main-chat").classList.add("d-none");
            document.querySelector(".welcome-chat").classList.remove("d-none");
            sendToBackend("", "showUsersFriend", "");
        }
        else
            loadContentInDiv("#home");
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