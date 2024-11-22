
import { Component } from "../../../core/component.js";
import { MessageCard } from "./message_card.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class ChatWindow extends Component {

    /* === Template : ====================================================== */
    get template()
    {
        return /* html */ `
            <div class="chat-header">
                <div class="avatar">
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

            <div id="messages" class="messages"></div>
        `;
    }

    /* === Styles : ========================================================= */
    get styles()
    {
        return /* css */ `
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

            .messages {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
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

            @media (max-width: 900px) {
                .chat-header {
                    padding: 20px;
                }

                .chat-header img {
                    width: 30px;
                    height: 30px;
                }
            }

            @media (max-width: 716px) {
                .chat-header {
                    font-size: 1em;
                }
            }

            @media (max-width: 450px) {
                .chat-header {
                    font-size: 0.5em;
                }
            }
        `;
    }

    /* === Get Date String : ==================================================== */
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

    /* === New Day Card : =================================================== */
    newDayCard(dateString) {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.textContent = '- ' + dateString + ' -';
        return dayCard;
    }

    /* === Update : ========================================================= */
    update(user, messages) {
        const messagesElement = this.shadowRoot.getElementById('messages');
        const avatarElement = this.shadowRoot.getElementById('avatar');
        const usernameElement = this.shadowRoot.getElementById('username');

        usernameElement.textContent = user.username;
        avatarElement.src = user.avatar;
        avatarElement.alt = user.username;
        this.previousDay = "01 Jan 1900";

        while (messagesElement.firstChild){
            messagesElement.removeChild(messagesElement.firstChild);
        }

        messages.forEach(message => {

            const { msgDay, msgTime } = this.getDateString(message.time);
            if (msgDay !== this.previousDay) {
                messagesElement.appendChild(this.newDayCard(msgDay));
                this.previousDay = msgDay;
            }

            const messageCard = new MessageCard(msgTime, message.type);
            messageCard.textContent = message.body;
            messagesElement.appendChild(messageCard);
        });

        messagesElement.scrollTop = messagesElement.scrollHeight;
    }

    /* === add Message : ==================================================== */
    addMessage(message) {
        const messagesElement = this.shadowRoot.getElementById('messages');
        const { msgDay, msgTime } = this.getDateString(message.time);

        if (msgDay !== this.previousDay) {
            messagesElement.appendChild(this.newDayCard(msgDay));
            this.previousDay = msgDay;
        }

        const messageCard = new MessageCard(msgTime, message.type);
            messageCard.textContent = message.body;
            messagesElement.appendChild(messageCard);

        messagesElement.scrollTop = messagesElement.scrollHeight;
    }
}
