
// 1. get the data from the server: room and users info
const data = [
    {
        id: "1",
        user: {
            id: "1",
            username: 'jamal',
            avatar: '/static/assets/imgs/user_avatar.png',
        },
        messages: [
            {
                time: '00:00',
                type: 'received',
                content: 'hello !'
            },
            {
                time: '00:00',
                type: 'received',
                content: 'how are you ?'
            },
            {
                time: '00:00',
                type: 'sent',
                content: 'hello !'
            }
        ]
    },

    {
        id: "2",
        user: {
            id: "3",
            username: 'nassima',
            avatar: '/static/assets/imgs/google_icon.svg',
        },
        messages: [
            {
                time: '00:00',
                type: 'received',
                content: 'hello !'
            },
        ]
    }
];
//===============================================================================

import { Component } from "../../../core/component.js";
import { UserCard } from "./user_card.js";

/* *************************************************************************** #
#   * Chat application Class :                                                 #
# *************************************************************************** */
export class ChatApp extends Component
{
    /* === Template : ====================================================== */
    get template()
    {
        return /* html */ `
            <div class="main-container">
                <button id="toggle-sidebar"aria-label="Toggle Sidebar">
                    ☰
                </button>

                <aside class="sidebar" id="sidebar">
                    <h2 class="title">Chat</h2>

                    <div class="search-container">
                        <input id="search-input" type="text"
                               placeholder="Search...">

                        <img src="/static/assets/imgs/search_icon.svg"
                             alt="Search">
                    </div>

                    <div id="chat-list"></div>
                </aside>

                <main class="chat-area">
                    <chat-window id="chat-window"></chat-window>

                    <div class="input-area">
                        <input id="message-input" type="text" maxlength="200"
                               class="message-input"
                               placeholder="Type your message...">

                        <button id="send-button" class="send-button">
                            Send
                        </button>
                    </div>
                </main>
            </div>
        `;
    }

    /* === styles : ======================================================== */
    get styles()
    {
        return /* css */ `
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
                padding: 30px;
                column-gap: 20px;
            }

            .sidebar {
                width: 300px;
                background-color: #2c2c2c;
                padding: 20px;
                overflow-y: hidden;
                transition: transform 0.3s ease-in-out;
                border-radius: 30px 0 0 30px;
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

            #chat-window {
                flex: 1;
                overflow-y: auto;
                background-color: #2c2c2c;
                border-radius: 0 30px 0 0;
                margin-bottom: 20px;
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

            @media (max-width: 900px) {
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

            @media (max-width: 716px) {
                .main-container {
                    padding: 0;
                }
            }
        `;
    }

    /* === Initialize : ==================================================== */
    async init()
    {
        this.data = data; //data from the backend
    }

    /* === Render : ======================================================== */
    render()
    {
        super.render();
        const sidebar = this.shadowRoot.getElementById('chat-list');

        this.data.map(data => {
            const userCard = new UserCard(data.user, data.messages);
            userCard.id = data.id;
            sidebar.appendChild(userCard);
        });

        this.data = [];
    }

    /* === On Connected : ================================================== */
    onConnected()
    {
        const toggleButton = this.shadowRoot.getElementById('toggle-sidebar');
        const rooms = this.shadowRoot.getElementById('chat-list');
        const sendButton = this.shadowRoot.getElementById('send-button');
        const messageInput = this.shadowRoot.getElementById('message-input');

        this.addEventListener(toggleButton, 'click', toggleSidebar.bind(this));
        this.addEventListener(rooms, 'click', selectRoom.bind(this));
        this.addEventListener(sendButton, 'click', sendMessage.bind(this));
        this.addEventListener(messageInput, 'keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage.call(this);
            }
        })
    }

}

/* *************************************************************************** #
#   * Events Callbacks :                                                       #
# *************************************************************************** */

/* === Toggle sidebar : ===================================================== */
function toggleSidebar(event)
{
    if (event) event.preventDefault();
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const toggleButton = this.shadowRoot.getElementById('toggle-sidebar');

    toggleButton.textContent = toggleButton.textContent.trim() === '☰'? '✘':'☰';

    sidebar.classList.toggle('active');
}

/* === Select room : ======================================================== */
function selectRoom(event)
{
    event.preventDefault();
    if (event.target && event.target.tagName === 'USER-CARD')
    {
        toggleSidebar.call(this);
        this.selectedRoom = event.target;

        const userCards = this.shadowRoot.getElementById('chat-list').children;
        for (let i = 0; i < userCards.length; i++) {
            userCards[i].classList.remove('activeRoom');
        }
        this.selectedRoom.classList.add('activeRoom');


        const chatWindow = this.shadowRoot.getElementById('chat-window');
        const messages   = this.selectedRoom.messages;
        const user_info  = this.selectedRoom.user
        chatWindow.update(user_info, messages);
    }
}

/* === Send message : ======================================================= */
function sendMessage(event)
{
    if (event) event.preventDefault();
    const messageInput = this.shadowRoot.getElementById('message-input');
    const chat_window = this.shadowRoot.getElementById('chat-window');
    const message = messageInput.value.trim();
    if (message)
    {
        const massage = {
            time: "00:00",
            type: 'sent',
            content: message
        }

        this.selectedRoom.messages.push(massage);
        chat_window.addMessage(massage);

        messageInput.value = '';
        messageInput.focus();
    }
}
