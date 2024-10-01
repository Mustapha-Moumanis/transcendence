// ------------- Scroll Handler -------------

function smoothScrollToBottom(container) {
    container.scroll({
        top: container.scrollHeight,
        behavior: 'smooth'
    });
}

function scrollHandler(event) {
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
