import {currentSendto, sendToBackend} from "./socket.js"
import{removeNotif} from "./homeSocket.js"
import {createMessageElement, createEndOfConv} from "./conversationChat.js"


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

function scrollHandler() {
    const scrollelement = document.querySelector(".chat-box");
    oldScrollHeight = scrollelement.scrollHeight;
    var scrollPositionY = scrollelement.clientHeight- scrollelement.scrollTop;

    if (scrollPositionY === oldScrollHeight && scrollDisplay === true) {
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
}

function focusScroll() {
    const scrollelement = document.querySelector(".chat-box");
    scrollelement.addEventListener('scroll', handlerReference);
}

function removeScroll() {
    const scrollelement = document.querySelector(".chat-box");
    scrollelement.removeEventListener('scroll', handlerReference);
}

function showAllMessages(data) {

    // removeNotif(data.sendto, ".notifMessage");

    var messages = data['messages'];
    const container = document.querySelector("#id_chat_item_container");
    container.innerHTML = '';
    messages.forEach(message => {
        container.appendChild(createMessageElement(message));
        smoothScrollToBottom(container);
    });

    scrollDisplay = data["scrollDisplay"];
    if (!scrollDisplay) {
        container.appendChild(createEndOfConv(data));
        removeScroll();
    }
    document.querySelector("#id_message_send_input").value = "";

    // ==> This part for hiddin the loading part & display conversation.
    document.querySelector(".loading-chat").classList.add("d-none");
    document.querySelector(".main-chat").classList.remove("d-none");
    // =============================================== END OF THIS PART.

    scrollnb = 0;
    oldScrollHeight = 0;
    if (scrollDisplay)
        focusScroll();
}

function loadMoreContent(data){
    var messages = data['messages'];
    // --------- remove loading
    const loading = document.querySelector(".chat-loading");
    loading.remove();
    // ------------------------
    const container = document.querySelector("#id_chat_item_container");
    messages.forEach(message => {
        container.appendChild(createMessageElement(message));
    });
    document.querySelector("#id_message_send_input").value = "";

    scrollDisplay = data["scrollDisplay"];
    if (!scrollDisplay) {
        container.appendChild(createEndOfConv(data));
        removeScroll();
    }
    focusScroll();
}


export {
    scrollHandler,
    removeScroll,
    smoothScrollToBottom,
    loadMoreContent,
    showAllMessages,
}