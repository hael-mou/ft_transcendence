
import { Component } from "../../core/component.js";
import { chatGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Http, Auth } from "../../tools/http.js";
import { wsm } from "../../core/wsManager.js";
import { UserCard } from "./user_card.js";

/* *************************************************************************** #
#   * ChatApp Component Class :                                                #
# *************************************************************************** */
export class ChatApp extends Component {

    /* === init : =========================================================== */
    async init() {
        let response = await Http.getwithAuth(chatGateway.getRoomsUrl);
        this.rooms = await response.json || [];
        this.toggleActive = false;
        this.myId = await Auth.getUserId();

        const unreadMsgsPromises = this.rooms.map(async (room) => {

            const id = room.id;
            room.messages = [];

            if (room.blocked_by) return;
            const unreadMsgsUrl = `${chatGateway.unReadMsgsUrl}?room=${id}`;
            const response      = await Http.getwithAuth(unreadMsgsUrl);
            room.messages = response?.json || [];
        });

        await Promise.all(unreadMsgsPromises);
    }


    /* === Render : ======================================================== */
    render() {
        super.render();
        const sidebar = this.shadowRoot.getElementById('chat-list');

        this.rooms.forEach(room => {
            room.unreadCount !== 0 ? sidebar.prepend(new UserCard(room))
                                   : sidebar.append(new UserCard(room));
        });

        this.rooms = [];

        const Room_id = _.getQueryParams().room;
        if (!Room_id) return;

        this.initRoom = sidebar.querySelector(`[id="${Room_id}"]`);
        if (!this.initRoom) {
            this.initRoom = new UserCard({
                peer: Room_id,
                allMessagesLoaded: true,
                messages: [],
            });
            sidebar.prepend(this.initRoom);
        }
    }


    /* === onConnected : =================================================== */
    onConnected() {
        const toggleButton   = this.shadowRoot.getElementById('toggle-sidebar');
        const rooms          = this.shadowRoot.getElementById('chat-list');
        const sendButton     = this.shadowRoot.getElementById('send-button');
        const messageInput   = this.shadowRoot.getElementById('message-input');
        const search         = this.shadowRoot.getElementById('search-input');
        const chatWindow = this.shadowRoot.getElementById('chat-window');



        this.receiveCallback = receiveMessage.bind(this);
        wsm.addListener('message', 'chat', this.receiveCallback);

        this.addEventListener(rooms, 'click', selectRoom.bind(this));
        this.addEventListener(sendButton, 'click', sendMessage.bind(this));
        this.addEventListener(toggleButton, 'click', toggleSidebar.bind(this));
        this.addEventListener(chatWindow.shadowRoot, 'click', userEvents.bind(this));
        this.addEventListener(messageInput, 'keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage.call(this);
            }
        })

        this.addEventListener(search, 'input', searchRooms.bind(this));

        if (this.initRoom) this.initRoom.click();

    }


    /* === onDisconnected : ================================================= */
    onDisconnected() {
        wsm.removeListener('message', 'chat', this.receiveCallback);
    }


    /* === Template : ====================================================== */
    get template() {

        return /* html */ `
            <div class="main-container">
                <button id="toggle-sidebar"aria-label="Toggle Sidebar">☰</button>

                <aside class="sidebar" id="sidebar">
                    <h2 class="title">Chat</h2>

                    <div class="search-container">
                        <input id="search-input" type="text" placeholder="Search...">
                        <img src="/static/assets/imgs/search_icon.svg"alt="Search">
                    </div>

                    <div id="chat-list"></div>
                </aside>

                <main id="chat-area" class="chat-area">
                    <div id="placeholder" class="placeholder" >
                        <img src="/static/assets/imgs/chat_icon.svg"alt="Placeholder">
                    </div>

                    <div id="block-panel" class="placeholder d-none" >
                        <img src="/static/assets/imgs/block_icon.svg"alt="block-icon">
                        <button id="unBlock-btn">Unblock</button>
                    </div>

                    <chat-window id="chat-window" class="d-none"></chat-window>

                    <div id="input-area" class="input-area d-none">
                        <input id="message-input" maxlength="200" class="message-input"
                               type="text" placeholder="Type your message...">

                        <button id="send-button" class="send-button">Send </button>
                    </div>
                </main>
            </div>
        `;
    }


    /* === Styles : ======================================================== */
    get styles() {
        return /* css */ `
            @import url("/static/assets/styles/common-style.css");
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            :host {
                font-family: 'Exo2', sans-serif;
                height: 100%;
                width: 100%;
                background-color: #1e1e1e;
                color: #fff;
            }

            .main-container {
                display: flex;
                height: 100%;
                overflow: hidden;
                column-gap: 20px;
            }

            .sidebar {
                width: 300px;
                background-color: #2c2c2c;
                padding: 20px;
                overflow-y: hidden;
                transition: transform 0.3s ease-in-out;
                border-radius: 20px 0 0 20px;
                height: 100%;
            }

            .chat-area {
                flex: 1;
                display: flex;
                flex-direction: column;

            }

            .title {
                font-size: 2rem;
                margin-bottom: 20px;
            }

            .title::first-letter {
                color: #6fbced;
            }

            .search-container {
                display: flex;
                align-items: center;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                padding: 5px 10px;
                margin-bottom: 20px;
            }

            #search-input {
                flex: 1;
                background: none;
                border: none;
                outline: none;
                color: #fff;
                padding: 5px;
            }

            #search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .search-container img {
                width: 20px;
                height: 20px;
                filter: invert(1);
            }

            #chat-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                overflow-y: auto;
                height: 100%;
                padding-bottom: 110px;
            }

            .activeRoom {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .user-card {
                display: flex;
                align-items: center;
                padding: 10px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                cursor: pointer;
            }

            .user-card img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }

            #chat-window, .placeholder {
                flex: 1;
                overflow-y: auto;
                background-color: #2c2c2c;
                border-radius: 0 20px 20px 0;
                margin-bottom: 20px;
                height: 100%;
            }

            .placeholder {
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                margin: 0;
                gap: 13px;
            }

            .placeholder img {
                width: 100px;
                filter: invert(40%) sepia(73%) saturate(393%) hue-rotate(174deg) brightness(98%) contrast(89%);
            }

            #block-panel img {
                filter: contrast(0.5) blur(1px);
            }

            #block-panel button {
                background-color: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                cursor: pointer;
            }


            .input-area {
                display: flex;
                gap: 10px;
            }

            .message-input {
                flex: 1;
                border: none;
                border-radius: 5px;
                background-color: rgba(255, 255, 255, 0.1);
                color: #fff;
                height: 60px;
                padding: 0 30px;
                font-family: 'Exo2', sans-serif;
            }

            .send-button {
                padding: 10px 20px;
                background-color: #6fbced;
                color: white;
                border: none;
                border-radius: 5px 5px 30px;
                cursor: pointer;
            }

            .d-none {
                display: none;
            }

            #toggle-sidebar {
                display: none;
                position: fixed;
                top: 17px;
                left: 132px;
                z-index: 100000;
                background-color: #2c2c2c;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 10px;
                cursor: pointer;
            }

            @media (max-width: 1280px) {
                .sidebar {
                    position: fixed;
                    left: -300px;
                    top: 0;
                    bottom: 0;
                    z-index: 1000;
                    border-radius: 0;
                }

                .sidebar h2 {
                    padding-left: 30px;
                }

                .sidebar.active {
                    transform: translateX(300px);
                }

                #toggle-sidebar {
                    display: block;
                }

                .chat-area {
                    width: 100%;
                }

                #chat-window, .send-button{
                    border-radius: 5px;
                }

                .input-area {
                    font-size: 12px;
                }

                .message-input {
                    height: 50px;
                }
            }
        `;
    }

}

/* *************************************************************************** #
#   *  Events Handlers :                                                       #
# *************************************************************************** */

/* === Toggle sidebar : ===================================================== */
function toggleSidebar(event) {

    if (event) event.preventDefault();
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const toggleButton = this.shadowRoot.getElementById('toggle-sidebar');

    toggleButton.textContent = toggleButton.textContent.trim() === '☰'? '✘':'☰';

    sidebar.classList.toggle('active');
    this.toggleActive = !this.toggleActive;
}

/* === Select room : ======================================================== */
async function selectRoom(event) {

    if (event.target && event.target.tagName === 'USER-CARD') {
        const chatWindow   = this.shadowRoot.getElementById('chat-window');
        const inputArea    = this.shadowRoot.getElementById('input-area');
        const placeholder  = this.shadowRoot.getElementById('placeholder');
        const blockPanel   = this.shadowRoot.getElementById('block-panel');

        if (this.toggleActive) toggleSidebar.call(this);
        if (!this.selectedRoom) placeholder.remove();

        this.oldSlectedRoom      = this.selectedRoom;
        this.selectedRoom        = event.target;

        const userCards = this.shadowRoot.getElementById('chat-list').children;
        for (const userCard of userCards) userCard.classList.remove('activeRoom');
        this.selectedRoom.classList.add('activeRoom');

        if (this.selectedRoom.blocked_by) return renderblockView.call(this);
        inputArea.classList.remove('d-none');
        chatWindow.classList.remove('d-none');
        blockPanel.classList.add('d-none');

        if (this.selectedRoom.unreadCount > 0) sendReadReceipts(this.selectedRoom);
        if(this.oldSlectedRoom !== this.selectedRoom) await chatWindow.update(this.selectedRoom);
    }
}

/* === userEvnets : ========================================================= */
async function userEvents(event) {

    event.preventDefault();
    if (event?.target.id === 'block') {

        const status = await sendBlockAction.call(this, 'block');
        if (!status) return;

        this.selectedRoom.blocked_by = this.myId;
        this.selectedRoom.displayUserStatus("hidden");
        renderblockView.call(this);
        return ;
    }

    if (event?.target.id === 'invite') {
        const myId = this.myId;
        const opponentId = this.selectedRoom.user.id
        sendMessage.call(this, null, `${myId}${opponentId}-${new Date().getTime()}`, 'invite');
    }
}

/* === unBlock user : ========================================================= */
function renderblockView() {

    const chatWindow   = this.shadowRoot.getElementById('chat-window');
    const inputArea    = this.shadowRoot.getElementById('input-area');
    const blockPanel   = this.shadowRoot.getElementById('block-panel');


    chatWindow.classList.add('d-none');
    blockPanel.classList.remove('d-none');
    inputArea.classList.add('d-none');

    const button = blockPanel.lastElementChild;

    if (this.selectedRoom.blocked_by != this.myId) {
        button.classList.add('d-none');
        return;
    }

    button.onclick = async (event) => {
        const status = await sendBlockAction.call(this, 'unblock')
        if (!status) return;

        this.selectedRoom.blocked_by = null;

        const target = this.selectedRoom;
        this.selectedRoom = "blocked";

        target.displayUserStatus("visible");
        selectRoom.call(this, {target: target});
    };
}


/* === sendBlockAction : ==================================================== */
async function sendBlockAction(event) {

    const url = chatGateway.blockUserUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({
        room: this.selectedRoom.room_id,
        action: event,
    });

    const response = await Http.postwithAuth(url, headers, data);
    if (!response.info.ok) {
        const alert = document.createElement('custom-alert');
        alert.setMessage("something went wrong...");
        alert.modalInstance.show();
        return false;
    }

    return true;
}

/* === Send acknowledge : =================================================== */
function sendReadReceipts(room) {

    room.messages.forEach((message) => {
        if (message.status !== 'read' && message.type === 'received') {
            message.status = 'read';
            wsm.send(JSON.stringify({
                type: 'ack',
                tracking_no: message.trackingNo,
                recipient_id: String(room.id),
                status: 'read',
            }));
        }
    });

    room.removeUnreadCount();
}

/* === Send message : ======================================================= */
function sendMessage(event, message= null, constentType= 'txt') {

    if (event) event.preventDefault();
    const messageInput    = this.shadowRoot.getElementById('message-input');
    const chat_window     = this.shadowRoot.getElementById('chat-window');
    const rooms           = this.shadowRoot.getElementById('chat-list');
    if(!message) message  = messageInput.value.trim();

    if (message)
    {
        const timestamp      = new Date().getTime();
        const randomId       = Math.floor(Math.random() * 1000);
        const trackingNumber = `MSG-${this.selectedRoom.id}${timestamp}${randomId}`;

        const messageData = {
            type        : 'sent',
            tracking_no : trackingNumber,
            time        : timestamp,
            status      : 'sent',
            contentType : constentType,
            body        : message,
        };

        this.selectedRoom.messages.push(messageData);
        chat_window.addMessage(messageData, this.selectedRoom.id);

        wsm.send(JSON.stringify({
            tracking_no    : trackingNumber,
            type           : "chat",
            recipient_id   : String(this.selectedRoom.id),
            content_type   : constentType,
            status         : "sent",
            body           : message
        }));

        messageInput.value = '';
        messageInput.focus();
        rooms.prepend(this.selectedRoom);
    }
}

/* === Receive message : ===================================================== */
async function receiveMessage(event) {

    event.preventDefault();
    const data = JSON.parse(event.data);
    const RoomList = this.shadowRoot.getElementById('chat-list');

    let targetRoom = RoomList.querySelector(`[id="${data.sender_id}"]`);
    if (targetRoom.blocked_by) return;

    if (!targetRoom) {

        const newRoom = {
            peer : data.sender_id,
            allMessagesLoaded: true,
            mewsages: [],
        }

        targetRoom = new UserCard(newRoom);
        RoomList.prepend(targetRoom);
    }

    const message = targetRoom.newMessage(data);
    RoomList.prepend(targetRoom);

    if (this.selectedRoom === targetRoom) {
        sendReadReceipts(targetRoom);
        const chatWindow = this.shadowRoot.getElementById('chat-window');
        chatWindow.addMessage(message, this.selectedRoom.id);
    }
}

/* === searchRooms : ======================================================== */
function searchRooms(event) {

    event.preventDefault();
    const searchInput = this.shadowRoot.getElementById('search-input');
    const rooms       = this.shadowRoot.getElementById('chat-list');
    const searchValue = searchInput.value.trim();

    for (const room of rooms.children) {
        if (room.isMatched(searchValue)) {
            room.classList.remove('d-none');
        } else {
            room.classList.add('d-none');
        }
    }
}
