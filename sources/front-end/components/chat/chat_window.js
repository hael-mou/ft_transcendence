
import { Component } from "../../core/component.js";
import { utils as _ } from "../../tools/utils.js";
import { MessageCard } from "./message_card.js";
import { Router } from "../../core/routing.js";
import { InviteCard } from "./invite_card.js";
import { Auth } from "../../tools/http.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class ChatWindow extends Component {

    /* === Get Date String : ================================================ */
    getDateString(time) {
        const date = new Date(time);
        const msgDay = date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const msgTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return { msgDay, msgTime };
    }

    /* === init : =========================================================== */
    async init() {
        this.myId = await Auth.getUserId();
    }

    /* === New Day Card : =================================================== */
    newDayCard(dateString) {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.textContent = '- ' + dateString + ' -';
        return dayCard;
    }


    /* === Update : ========================================================= */
    async update(room) {

        const avatarContainer = this.shadowRoot.getElementById('avatar-container');
        const avatarElement = this.shadowRoot.getElementById('avatar');
        const usernameElement = this.shadowRoot.getElementById('username');
        const messagesElement = this.shadowRoot.getElementById('messages');
        const messagesArea = this.shadowRoot.getElementById('messages-area');

        _.clear(messagesElement);

        if (!room.user) {
            for (let attempt = 0; attempt < 6; attempt++) {
                if (room.user) break;
                if (attempt === 5) return;
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }

        this.activeRoom = room;
        const user      = room.user;
        const messages  = await room.getMessages();

        usernameElement.textContent = "Chat with " + user.username||'anonymous';
        avatarElement.src = user.avatar || '/static/assets/imgs/user_avatar.png';
        avatarElement.alt = user.username || 'User Avatar';
        avatarContainer.setAttribute('data-link', `/profile?id=${user.id}`);
        this.previousDay = "01 Jan 1900";

        messages.forEach(message => {

            const { msgDay, msgTime } = this.getDateString(message.time);
            if (msgDay !== this.previousDay) {
                messagesElement.appendChild(this.newDayCard(msgDay));
                this.previousDay = msgDay;
            }

            const messageCard = new MessageCard(msgTime, message.type, message.trackingNo);

            if (message.contentType === 'invite') {
                messageCard.appendChild(new InviteCard(message, this.myId, user.id));
            }
            else {
                messageCard.textContent = message.body;
            }

            messagesElement.appendChild(messageCard);

        });

        messagesArea.scrollTop = messagesArea.scrollHeight;
    }


    /* === add Message : ==================================================== */
    addMessage(message, peerId) {
        const messagesElement = this.shadowRoot.getElementById('messages');
        const messagesArea = this.shadowRoot.getElementById('messages-area');
        const { msgDay, msgTime } = this.getDateString(message.time);

        if (msgDay !== this.previousDay) {
            messagesElement.appendChild(this.newDayCard(msgDay));
            this.previousDay = msgDay;
        }

        const messageCard = new MessageCard(msgTime, message.type, message.trackingNo);

        if (message.contentType === 'invite') {
            messageCard.appendChild(new InviteCard(message, this.myId, peerId));
        }
        else {
            messageCard.textContent = message.body;
        }

        messagesElement.appendChild(messageCard);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }


    /* === onConnected : =================================================== */
    onConnected() {

        const avatar = this.shadowRoot.getElementById('avatar');
        const avatarContainer = this.shadowRoot.getElementById('avatar-container');
        const messagesArea = this.shadowRoot.getElementById('messages-area');


        avatar.onerror = () => {
            avatar.src = '/static/assets/imgs/user_avatar.png';
        };

        this.addEventListener(avatarContainer, 'click', Router.handleRouting.bind(this));
        this.addEventListener(messagesArea, 'scroll', this.leadingMessage.bind(this));
    }


    /* === leadingMessage : ================================================= */
    async leadingMessage(event) {

        if (event.target.scrollTop === 0 && !this.activeRoom.allMessagesLoaded) {

            const loadingElement = this.shadowRoot.getElementById('loading');
            const messagesElement = this.shadowRoot.getElementById('messages');
            const messages = await this.activeRoom.getMessages();
            const topElement = messagesElement.firstElementChild;
            const topMessage = messagesElement.children[1];

            loadingElement.classList.remove('d-none');
            this.previousDay = "01 Jan 1900";
            await new Promise(resolve => setTimeout(resolve, 500));

            for (const message of messages) {

                if (message.trackingNo === topMessage.tn) break;

                const { msgDay, msgTime } = this.getDateString(message.time);
                if (msgDay !== this.previousDay) {
                    messagesElement.insertBefore(this.newDayCard(msgDay), topElement);
                    this.previousDay = msgDay;
                }

                const messageCard = new MessageCard(msgTime, message.type, message.trackingNo);
                messageCard.textContent = message.body;

                messagesElement.insertBefore(messageCard, topElement);
            };

            loadingElement.classList.add('d-none');
        }
    }

    /* === Template : ====================================================== */
    get template() {

        return /* html */ `
            <div class="chat-header">
                <div id="avatar-container" class="avatar">
                    <img id="avatar" src="/static/assets/imgs/user_avatar.png"
                         alt="User Avatar">

                    <h2 id="username">Chat with Jamal</h2>
                </div>

                <div class="event">
                    <img id="block" src="/static/assets/imgs/block_icon.svg"
                         alt="Block">

                    <img id="invite" src="/static/assets/imgs/invite_icon.svg"
                         alt="Invite">
                </div>

            </div>

            <div id="messages-area" class="messages-area">
                <div id="loading" class="d-none">loading...</div>
                <div id="messages" class="messages"></div>
            </div>
        `;
    }


    /* === Styles : ========================================================= */
    get styles() {

        return /* css */ `

            @import url("/static/assets/styles/common-style.css");
            :host {
                font-family: 'Exo2', sans-serif;
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            .chat-header {
                width: 100%;
                display: flex;
                align-items: center;
                padding: 33px 20px 33px 25px;
                color: #fff;
                text-shadow: var(--color-primary) 1px 0 10px;
                border-bottom: 6px double #424242;
                justify-content: space-between;
            }

            .chat-header img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
                background-color: #fff;
            }

            .avatar {
                display: flex;
                align-items: center;
            }

            .day-card {
                text-align: center;
                margin: 10px 0;
                color: #fff;
                font-family: "cursive" , "sans-serif";
                font-size: 0.8em;
                text-shadow: var(--color-primary) 1px 0 10px;
            }

            .messages-area {
                flex: 1;
                overflow-y: scroll;
                padding: 10px;
            }

            .messages {
                min-with: 100%;
                min-height: 105%;
            }

            #block, #invite {
                cursor: pointer;
                background-color: #ffffff00;
                filter: invert(1);
                padding: 6px;
                border: 1px solid #ee706f;
            }

            #block:hover, #invite:hover {
                background-color: #ee706f;
            }

            #loading {
                text-align: center;
                background: #2c2c2c;
                position: sticky;
                top: -12px;
                padding: 12px;
                color: #fff;
                font-family: "Exo2" , "sans-serif";
                font-size: 1em;
                text-shadow: var(--color-primary) 1px 0 10px;
                font-weight: 800;
            }

            .d-none {
                display: none !important;
            }

            @media (max-width: 900px) {
                .chat-header {
                    padding: 20px;
                }

                .chat-header img {
                    width: 30px;
                    height: 30px;
                }

                #loading {
                    font-size: 0.8em;
                    padding: 10px;
                }
            }

            @media (max-width: 716px) {
                .chat-header {
                    font-size: 1em;
                }

                #loading {
                    font-size: 0.7em;
                    padding: 8px;
                    font-weight: 600;
                }
            }

            @media (max-width: 450px) {
                .chat-header {
                    font-size: 0.5em;
                }

                #loading {
                    font-size: 0.5em;
                    padding: 6px;
                }
            }
        `;
    }

}
