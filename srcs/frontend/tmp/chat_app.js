
import { Component } from "../../../core/component.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class ChatApp extends Component
{

    /* === constructor : ==================================================== */
    constructor()
    {
        super();
        this.data = [
            {
                id: "1",
                name: 'jamal',
                loading: true,
                chats: [
                    {'sender': 'received', 'message': 'Hello, how are you?', 'timestamp': 1731242720548},
                    {'sender': 'sent', 'message': 'so9k', 'timestamp': 1731942720548},
                    {'sender': 'sent', 'message': '??', 'timestamp': 1731942720548},
                    {'sender': 'received', 'message': 'Hello, how are you?', 'timestamp': 1731942722548},
                    {'sender': 'received', 'message': 'Hello, how are you?', 'timestamp': 1731942722548} ,
                    {'sender': 'received', 'message': 'Hello, how are you?', 'timestamp': 1731942722548},
                    {'sender': 'received', 'message': 'Hello, how are you?', 'timestamp': 1731942722548},
                ]
            },
            {
                id: "2",
                name: 'nassima',
                loading: true,
                chats: []
            },
        ];
        console.log((new Date()).getTime());
    }

    onConnected()
    {
        const list = this.shadowRoot.getElementById('chat-list');
        const messages = this.shadowRoot.getElementById('messages');


        list.addEventListener('click', event => {
            if (event.target && event.target.tagName === 'LI')
            {
                const select = this.data.find(data => data.name === event.target.textContent);

                while (messages.firstChild)
                    messages.removeChild(messages.firstChild);

                let lastDate = null;
                select.chats.forEach(chat => {
                    const currentDate = new Date(chat.timestamp).toDateString();
                    if (lastDate !== currentDate) {
                        const dateDivider = document.createElement('div');
                        dateDivider.classList.add('date-divider');
                        dateDivider.textContent = currentDate;
                        messages.appendChild(dateDivider);
                        lastDate = currentDate;
                    }

                    const message = document.createElement('div');
                    message.classList.add('message');
                    message.classList.add(chat.sender === 'sent' ? 'sent' : 'received');
                    message.textContent = chat.message + ' - ' + new Date(chat.timestamp).toLocaleString();
                    messages.appendChild(message);
                });

            }
        });

        const button = this.shadowRoot.querySelector('.send-button');
        const input = this.shadowRoot.querySelector('.message-input');

        button.addEventListener('click', () => {
            const select = this.data.find(data => data.name === 'jamal');
            select.chats.push({'sender': 'sent', 'message': input.value});
            const message = document.createElement('div');
            message.classList.add('message');
            message.classList.add('sent');
            message.textContent = input.value;
            messages.appendChild(message);
            input.value = '';
        });

    }

    /* === template : ======================================================= */
    get template()
    {
        //const t = JSON.stringify(this.data[0]);
        //console.log( JSON.parse(t));

        return /* html */ `
      <div class="main-container">

                <!-- sidebar component -->
                <aside class="sidebar">
                    <h2>Chat</h2>
                    <ul id="chat-list" >
                        ${this.data.map(data =>
                                `<li class="chat-item">${data.name}</li>`)
                        .join('')}
                    </ul>
                </aside>

                <!-- chat area component -->
                <main class="chat-area">
                    <div class="chat-header">
                        <h2>Chat with jamal</h2>
                    </div>

                    <div id="messages" class="messages">
                            
                    </div>

                    <div class="input-area">
                        <input type="text" class="message-input" placeholder="Type your message...">
                        <button class="send-button">Send</button>
                    </div>

                </main>
      </div>
    `;
    }

    /* === style : ================================================== */
    get styles()
    {
        return /* css */ `
        :host {
            display: flex;
            flex-direction: column;
            font-family: 'Exo2', sans-serif;
            --bg-color: #1a1a1a;
            --text-color: #ffffff;
            --gradient-start: rgba(56, 56, 56, 0.5);
            --gradient-end: rgba(44, 44, 44, 0.5);
            height: 100%;
          }

          .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }

          .logo {
            width: 100px;
            height: auto;
          }

          .search-container {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 5px 10px;
          }

          .search-input {
            border: none;
            background: none;
            color: var(--text-color);
            padding: 5px;
            width: 200px;
          }

          .user-info {
            display: flex;
            align-items: center;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .main-container {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .sidebar {
            width: 250px;
            background-color: #3b3e49;
            color: #fff;
            overflow-y: auto;
          }

          #chat-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }

          .chat-item {
            padding: 10px;
            cursor: pointer;
          }

          .chat-item:hover {
            background-color: #5e616a;
          }

          .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-color: #eff3f7;
          }

          .chat-header {
            padding: 10px;
            background-color: #f3f3f3;
            border-bottom: 1px solid #ddd;
          }

          .messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
          }

          .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            max-width: 70%;
          }

          .message.sent {
            background-color: #6fbced;
            align-self: flex-end;
            margin-left: auto;
          }

          .message.received {
            background-color: #58b666;
          }

          .input-area {
            display: flex;
            padding: 10px;
            background-color: #f3f3f3;
          }

          .message-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }

          .send-button {
            padding: 10px 20px;
            background-color: #6fbced;
            color: white;
            border: none;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
          }
        `;
    }

}
