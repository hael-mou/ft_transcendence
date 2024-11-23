import { Component } from "../../../core/component.js";
import { UserCard } from "./user_card.js";

export class ChatApp extends Component {
    /* === Initialize : ==================================================== */
    async init() {
        this.data = [
            {
                id: "1",
                user: {
                    id: "1",
                    username: 'jamal',
                    avatar: '/static/assets/imgs/user_avatar.png',
                }
            },
            {
                id: "2",
                user: {
                    id: "3",
                    username: 'nassima',
                    avatar: '/static/assets/imgs/google_icon.svg',
                }
            }
        ]
    }

    /* === Render : ======================================================== */
    render() {
        super.render();
        const sidebar = this.shadowRoot.getElementById('chat-list');

        this.data.map(data => {
            const userCard = new UserCard(data.user);
            userCard.id = data.id;
            sidebar.appendChild(userCard);
        });

        this.data = [];
    }

    /* === Template : ====================================================== */
    get template() {
        return /* html */ `
                <div class="container-fluid d-flex flex-column h-100">

                    <!-- Sidebar -->
                    <aside class="sidebar p-3 d-flex flex-column d-md-none" id="sidebar">
                        <button class="btn btn-light" id="toggle-sidebar-btn">
                            <i class="fas fa-bars"></i>
                        </button>
                        <h2 class="title">Chat</h2>
                        <div class="search-container mb-3">
                            <input id="search-input" type="text" placeholder="Search..." class="form-control">
                            <img src="/static/assets/imgs/search_icon.svg" alt="Search" class="search-icon">
                        </div>
                        <div id="chat-list" class="list-group">
                            <!-- Dynamic user cards will be added here -->
                        </div>
                    </aside>

                    <!-- Main Content Area -->
                    <main class="chat-area d-flex flex-column flex-grow-1">
                        <div class="top-bar d-none d-md-flex justify-content-between align-items-center">
                            <h2 class="title">Chat</h2>
                        </div>
                        <chat-window></chat-window>
                        <div class="input-area d-flex mt-3 p-3">
                            <input type="text" maxlength="200" class="message-input form-control" placeholder="Type your message...">
                            <button class="send-button btn btn-primary ms-2">Send</button>
                        </div>
                    </main>
                </div>
        `;
    }

    /* === Styles : ======================================================== */
    get styles() {
        return /* css */ `

            @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

            :host {
                display: block;
                font-family: 'Exo2', sans-serif;
                height: 100%;
                width: 100%;
            }

            /* Sidebar Styles */
            .sidebar {
                background-color: #000;
                color: #fff;
                position: fixed;
                top: 0;
                left: -1000px;
                width: 250px;
                height: 100%;
                padding: 20px;
                transition: left 0.3s ease-in-out;
                box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
                z-index: 999;
            }

            .sidebar.open {
                left: 0;
            }

            .sidebar h2 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }

            .search-container {
                display: flex;
                align-items: center;
                background-color: rgb(255 255 255 / 3%);
                border-radius: 10px;
                padding: 5px 10px;
            }

            #search-input {
                border: none;
                background: none;
                color: var(--text-color);
                width: 100%;
                outline: none;
            }

            #search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .search-container img {
                width: 20px;
                height: 20px;
                filter: invert(1);
                margin-left: 7px;
            }

            .top-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
            }

            .input-area {
                display: flex;
                padding: 30px;
                min-width: 342px;
                margin-top: 20px;
                border-radius: 10px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                background: rgb(255 255 255 / 3%);
                box-shadow: inset 0 0 3px 0px #ffffffb5;
            }

            .message-input {
                flex: 1;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #fff0;
                font-size: 15px;
                color: #fff;
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

            /* Mobile Styles (Small Devices) */
            @media (max-width: 767px) {
                /* Sidebar toggle button */
                #toggle-sidebar-btn {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    z-index: 1000;
                }

                /* Sidebar becomes visible when open */
                .sidebar.open {
                    left: 0;
                }

                .chat-area {
                    padding-left: 0;
                }

                /* Content area shifts left when sidebar is open */
                .chat-area.d-flex {
                    transition: margin-left 0.3s ease;
                }
            }

            /* Medium and Large Screens */
            @media (min-width: 768px) {
                .sidebar {
                    position: static;
                    transform: none;
                    width: 250px;
                    box-shadow: none;
                }

                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .sidebar h2 {
                    font-size: 2.5rem;
                    padding: 30px 0 10px 0;
                }

                /* Main content area shifts when sidebar is visible */
                .chat-area {
                    margin-left: 250px;
                }
            }
        `;
    }

    /* === Lifecycle Methods : ============================================ */
    onConnected() {
        const toggleButton = this.shadowRoot.getElementById("toggle-sidebar-btn");
        const sidebar = this.shadowRoot.querySelector('.sidebar');
        const chatArea = this.shadowRoot.querySelector('.chat-area');

        toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("open");

            // Adjust chat area when sidebar is toggled
            if (sidebar.classList.contains('open')) {
                chatArea.style.marginLeft = '250px';
            } else {
                chatArea.style.marginLeft = '0';
            }
        });
    }
}
