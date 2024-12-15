
import { profileGateway, chatGateway } from "../../core/config.js";
import { Component } from "../../core/component.js";
import { Http } from "../../tools/http.js";
import { wsm } from "../../core/wsManager.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class UserCard  extends Component {

    /* === Constructor : =================================================== */
    constructor(room) {
        super();
        this.id                 = room.peer.toString()
        this.room_id            = room.id
        this.unreadCount        = 0
        this.messagesMap        = new Map()
        this.messages           = []
        this.allMessagesLoaded  = room.allMessagesLoaded || false
        this.nextPage           = `${chatGateway.getMessagesUrl}?room=${room.id}`
        this.blocked_by         = room.blocked_by

        room.messages.forEach(message => {
            this.newMessage(message);
        });
    }

    /* === init : ========================================================== */
    async init() {
        const profileUrl = `${profileGateway.getProfileUrl}?id=${this.id}`;
        let response     = await Http.getwithAuth(profileUrl);
        this.user        = response?.json[0];

        this.statusUrl  = `${chatGateway.getUserStatusUrl}?id=${this.id}`;

        response        = await Http.getwithAuth(this.statusUrl);
        this.status     = response?.json || {status: 'disconnected'};
    }


    /* === onConnected : ================================================== */
    onConnected() {

        const avatar = this.shadowRoot.getElementById('avatar');
        avatar.onerror = () => {
            avatar.src = '/static/assets/imgs/user_avatar.png';
        };

        this.changeUserCallback = this.changeUserStatus.bind(this);
        wsm.addListener('message', 'user_status', this.changeUserCallback);
    }

    /* === onDisconnected : ================================================ */
    onDisconnected() {
        wsm.removeListener('message', 'user_status', this.changeUserCallback);
    }

    /* === getMessages : =================================================== */
    async getMessages() {

        if (this.allMessagesLoaded) return this.messages;

        const response = await Http.getwithAuth(this.nextPage);
        const page     = response?.json || [];
        this.nextPage  = page.next;

        page.results.forEach(message => {
            this.newMessage(message);
        });

        if (!this.nextPage) this.allMessagesLoaded = true;

        return this.messages;
    }

    /* === new Message : =================================================== */
    newMessage(message) {

        const messageData = {
            type: message.sender_id === this.id ? 'received' : 'sent',
            trackingNo: message.tracking_no,
            time: message.sent_at,
            status: message.status,
            contentType: message.content_type,
            body: message.body
        };

        if (message.status !== 'read' && messageData.type === 'received') {
            this.unreadCount += 1;

            const unreadCountElement = this.shadowRoot.getElementById('unread-count');
            if (unreadCountElement) {
                unreadCountElement.textContent = this.unreadCount;
                unreadCountElement.classList.remove('d-none');
            }
        }

        if (!this.messagesMap.has(messageData.trackingNo)) {

            this.messagesMap.set(messageData.trackingNo, messageData);
            this.messages.push(messageData);
            this.messages.sort((a, b) => a.time - b.time);
        }

        return messageData;
    }

    /* === removeUnreadCount : ============================================= */
    removeUnreadCount() {
        const unreadCount = this.shadowRoot.getElementById('unread-count');
        unreadCount.classList.add('d-none');

        this.unreadCount = 0;
    }


    /* ==== isMatched : ==================================================== */
    isMatched(search) {
        if (!search) return true;
        const username = this.user.username.toLowerCase().includes(search.toLowerCase());
        const fname    = this.user.first_name.toLowerCase().includes(search.toLowerCase());
        const lname    = this.user.last_name.toLowerCase().includes(search.toLowerCase());
        return username || fname || lname;
    }

    /* === changeUserStatus : ============================================== */
    async changeUserStatus(event) {

        const evnetData = JSON.parse(event.data);
        if (evnetData.user_id !== this.id) return;

        const onlineElement = this.shadowRoot.getElementById('status');

        if (evnetData.status === 'connected') {
            onlineElement.classList.remove('offline');
            onlineElement.classList.add('online');

        } else {
            const response      = await Http.getwithAuth(this.statusUrl);
            const data          = response?.json;
            if (data.status === 'disconnected')
            {
                onlineElement.classList.remove('online');
                onlineElement.classList.add('offline');
            }
        }

    }

    /* === displayUserStatus : ============================================ */
    displayUserStatus(status) {
        const onlineElement = this.shadowRoot.getElementById('status');
        status === 'visible' ? onlineElement.classList.remove('d-none')
                             : onlineElement.classList.add('d-none');
    }

    /* === Template : ====================================================== */
    get template()
    {
        return /* html */ `
            <div class="card-container">
                <img id="avatar" alt="User Avatar" src="${this.user?.avatar||
                     '/static/assets/imgs/user_avatar.png'}">

                <div class="card-content">
                    <div class="user-info">
                        <h3>${this.user?.username || anonymous}</h3>
                        <span class="${this.status.status === 'connected' ? 'online' : 'offline'}
                              ${this.blocked_by ? 'd-none' : ''}" id="status" >
                            Online
                        </span>
                    </div>
                    <span id="unread-count" class="new-message
                        ${this.unreadCount ? '' : 'd-none'}">
                        ${this.unreadCount}
                    </span>
                </div>
            </div>
        `;
    }


    /* === styles : ======================================================== */
    get styles()
    {
        return /* css */ `
            :host {
                display: flex;
                align-items: center;
                border-radius: 10px;
                padding: 5px 10px;
                margin-bottom: 30px;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .card-container {
                display: flex;
                align-items: center;
                border-radius: 10px;
                width: 100%;
                margin-bottom: 1px;
                background: rgb(255 255 255 / 3%);
                padding: 0 0 10px 10px;
                min-height: 71px;
            }

            .card-container img {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                object-fit: cover;
                margin: 7px 10px 0px 4px;
                background-color: #fff;
                box-shadow: inset 0 0 3px 0px #fff;
            }

            .card-container:hover {
                background: rgb(255 255 255 / 5%);
                box-shadow: inset 0 0 3px 0px #fff;
            }

            .card-content {
                display: flex;
                justify-content: space-between;
                align-items: start;
                width: 100%;
            }

            .card-content h3 {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
            }


            .user-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 5px;
            }

            .online, .offline {
                font-size: 12px;
                color: #00c853;
                background-color: rgba(0, 200, 83, 0.1);
                padding: 3px 6px;
                border-radius: 12px;
                width: fit-content;
            }

            .offline {
                color: #f44336;
                background-color: rgba(244, 67, 54, 0.1);
            }

            .new-message {
                font-size: 12px;
                font-weight: 600;
                text-shadow: 0 0 4px black;
                color: #fff;
                background-color: #04babd;
                padding: 4px 0 0 0;
                border-radius: 0 10px 0 50%;
                aspect-ratio: 1 / 1;
                width: 28px;
                text-align: center;
            }

            .d-none {
                display: none !important;
            }
        `;
    }

}
