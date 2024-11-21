
import { Component } from "../../../core/component.js";

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

    /* === Update : ========================================================= */
    update(user, new_messages)
    {
        const messages = this.shadowRoot.getElementById('messages');
        const avatar = this.shadowRoot.getElementById('avatar');
        const username = this.shadowRoot.getElementById('username');
        // const block = this.shadowRoot.getElementById('block');
        // const invite = this.shadowRoot.getElementById('invite');

        username.textContent = user.username;
        avatar.src = user.avatar;
        avatar.alt = user.username;

        while (messages.firstChild){
            messages.removeChild(messages.firstChild);
        }

        new_messages.forEach(message => {
            const messageCard = `
                <message-card time="${message.time}" type="${message.type}">
                    ${message.content}
                </message-card>
            `;
            messages.innerHTML += messageCard;
        });
        messages.scrollTop = messages.scrollHeight;
    }

    /* === add Message : ==================================================== */
    addMessage(message)
    {
        const messages = this.shadowRoot.getElementById('messages');
        const messageCard = `
            <message-card time="${message.time}" type="${message.type}">
                ${message.content}
            </message-card>
        `;
        messages.innerHTML += messageCard;
        messages.scrollTop = messages.scrollHeight;
    }
}
