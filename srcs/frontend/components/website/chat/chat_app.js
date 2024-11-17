
import { Component } from "../../../core/component.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class ChatApp extends Component
{
    constructor()
    {
        super();
        // this.ws = new WebSocket("ws://localhost:8000/ws/chat");

        // this.ws.onmessage = (event) => {
        //     console.log(event.data);
        // }
    }

    // === template : ================================================== */
    get template()
    {
        return /* html */ `
      <div class="main-container">
        <aside class="sidebar">
          <ul class="chat-list">
            <li class="chat-item">Chat 1</li>
            <li class="chat-item">Chat 2</li>
            <li class="chat-item">Chat 3</li>
          </ul>
        </aside>
        <main class="chat-area">
          <div class="chat-header">
            <h2>Chat with Vincent Porter</h2>
          </div>
          <div class="messages">
            <div class="message received">message received</div>
            <div class="message sent">message sent.</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message received">message received</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
            <div class="message sent">message sent.</div>
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
            max-height: 100%;
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

          .chat-list {
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
