
import { Component } from "../core/component.js";
import { Router } from "../core/routing.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class BasePage extends Component
{
    /* === template : ======================================================= */
    get template() {
        return /* html */ `
            <header class="top-bar">
                <img src="/static/assets/imgs/logo.svg" class="logo" alt="Logo">

                <div class="search-container">
                    <input type="text" class="search-input"
                           placeholder="Search...">

                    <img src="/static/assets/imgs/search_icon.svg" alt="Search">
                </div>

                <div class="notification-container">
                    <img id="avatar" src="${localStorage.getItem('avatar')}"
                         class="user-avatar" alt="User Avatar">

                    <span class="user-name">Hael-mou</span>

                    <button class="notification-button">
                        <img
                            src="/static/assets/imgs/notification_icon.svg"
                            alt="Notifications">

                        <span class="notification-badge">3</span>
                    </button>
                </div>
            </header>

            <div class="container-main">
                <nav id="nav" class="container-nav">
                    ${this.navItems.map((navItem, index) => /* html */ `
                        <div class="nav-item ${window.location.pathname.startsWith(navItem.href) ? 'selected' : ''}"
                            data-link="${navItem.href}">

                            <div class="nav-background"></div>

                            <img class="nav-icon ${navItem.iconClass}"
                                src="${navItem.iconSrc}" alt="${navItem.name}"/>
                        </div>
                    `).join('')}
                </nav>

                <main class="content-area">
                    <slot></slot>
                </main>
            </div>
        `;
    }

    /* === navItems : ======================================================= */
    get navItems() {

        return [
            {
                name: 'profile',
                iconClass: 'home-icon',
                iconSrc: '/static/assets/imgs/home_icon.svg',
                href: '/profile'
            },
            {
                name: 'tournaments',
                iconClass: 'tour-icon',
                iconSrc: '/static/assets/imgs/tournements.svg',
                href: '/tournaments'
            },
            {
                name: 'chat',
                iconClass: 'chat-icon',
                iconSrc: '/static/assets/imgs/chat_icon.svg',
                href: '/chat'
            },
            {
                name: 'game',
                iconClass: 'game-icon',
                iconSrc: '/static/assets/imgs/game_icon.svg',
                href: '/game'
            },
            {
                name: 'setting',
                iconClass: 'setting-icon',
                iconSrc: '/static/assets/imgs/Setting_icon.svg',
                href: '/settings'
            },
        ];
    }

    /* === styles : ========================================================= */
    get styles() {
        return /*css*/`

            @import url("/static/assets/styles/common-style.css");

            :host {
                height: 100vh;
                height: 100dvh;
                display: flex;
                justify-content: center;
                flex-direction: column;
                --bg-color: #1a1a1a;
                --text-color: #ffffff;
                --gradient-start: rgba(56, 56, 56, 0.5);
                --gradient-end: rgba(44, 44, 44, 0.5);
                overflow: hidden;
                width: min(96%, 1924px);
                gap: 1.5rem;
                font-family: 'Exo2', sans-serif;
                padding: 4rem 0 !important;
            }

            img {
                pointer-events: none;
            }

            .top-bar {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 15px 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 30px;
                background: linear-gradient(to right, var(--gradient-start) 3%,
                            var(--gradient-end) 100%);
                box-sizing: border-box;
            }

            .logo {
                width: 140px;
                height: auto;
            }

            .search-container {
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 5px 10px;
            }

            .search-input {
                padding: 8px 12px;
                border: none;
                background: none;
                color: var(--text-color);
                width: 150px;
                outline: none;
            }

            .search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .search-container img {
                width: 20px;
                height: 20px;
                filter: invert(1);
                padding-left: 7px;
            }

            .notification-container {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 5px 10px;
            }

            .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .user-name {
                margin-right: 15px;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
            }

            .notification-button {
                background: none;
                border: none;
                cursor: pointer;
                position: relative;
            }

            .notification-button img {
                width: 24px;
                height: 24px;
                filter: invert(1);
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background-color: var(--color-primary, #ff4081);
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
            }

            .container-main {
                display: flex;
                flex: 1;
                overflow: hidden;
                box-sizing: border-box;
                border-radius: 30px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: linear-gradient(to right, var(--gradient-start) 3%,
                                var(--gradient-end) 100%);
            }

            .container-nav {
                min-width: 93px;
                border-right: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .nav-item {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 93px;
                cursor: pointer;
            }

            .nav-background {
                position: absolute;
                left: 0;
                width: 0;
                height: 79%;
                background-color: rgba(33, 148, 148, 0.1);
                border-radius: 0 30px;
                transition: width 0.3s ease;
            }

            .nav-item:hover .nav-background,
            .nav-item.selected .nav-background {
                width: 100%;
            }

            .nav-icon {
                width: 32px;
                transition: transform 0.3s ease, filter 0.3s ease;
                z-index: 1;
            }

            .nav-item:hover .nav-icon {
                transform: scale(1.1);
                filter: brightness(1.2);
            }

            .nav-item.selected::before {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 24px;
                border-radius: 0 2px 2px 0;
                background-color: var(--color-primary, #ff4081);
            }

            .nav-item:first-child {
                margin-top: 40px;
            }

            .nav-item:last-child {
                margin-top: auto;
                margin-bottom: 10px;
            }

            .nav-item.selected .nav-background {
                animation: flash 0.5s ease-out;
            }

            .content-area {
                flex-grow: 1;
                padding: 20px;
                overflow-y: auto;
                position: relative;
            }

            @keyframes flash {
                0% { background-color: rgba(33, 148, 148, 0.1); }
                50% { background-color: rgba(33, 148, 148, 0.3); }
                100% { background-color: rgba(33, 148, 148, 0.1); }
            }

            @media (max-width: 2000px) {
                :host {
                    padding: 2rem 0 !important;
                    gap: 1rem;
                }
            }

            @media (max-width: 1300px) {
                .user-name {
                    display: none;
                }
            }

            @media (max-width: 900px) {
                :host {
                    padding: 1rem 0 !important;
                    gap: 0.5rem;
                }

                .top-bar {
                    flex-wrap: wrap;
                    justify-content: center;
                    padding: 10px;
                    border-radius: 5px;
                }

                .logo {
                    order: 1;
                    width: 100px;
                    margin-bottom: 10px;
                }

                .search-container {
                    order: 3;
                    width: 100%;
                    margin-top: 10px;
                }

                .search-input {
                    width: calc(100% - 40px);
                }

                .notification-container {
                    order: 2;
                    margin-left: auto;
                }

                .container-main {
                    flex-direction: column-reverse;
                    border-radius: 5px;
                }

                .container-nav {
                    width: 100%;
                    height: auto;
                    flex-direction: row;
                    justify-content: space-around;
                    border-right: none;
                    padding: 15px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }

                .nav-item {
                    width: 8%;
                    height: 40px;
                }

                .nav-item:first-child {
                    margin-top: 0;
                }

                .nav-item:last-child {
                    margin-top: 0;
                    margin-bottom: 0;
                }

                .nav-item.selected::before {
                    left: 50%;
                    top: 125%;
                    transform: translateX(-50%);
                    width: 24px;
                    height: 4px;
                    border-radius: 2px 2px 0  0;
                }

                .nav-background {
                    left: 10%;
                    top: 10%;
                    width: 80%;
                    height: 0;
                    transition: height 0.3s ease;
                }

                .nav-item:hover .nav-background,
                .nav-item.selected .nav-background {
                    width: 84%;
                    height: 90%;
                }
            }

            @media (max-width: 450px) {
                :host {
                    padding: 0.5rem 0 !important;
                }
            }
        `
    }

    /* === onConnected : ==================================================== */
    onConnected() {
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            this.addEventListener(item, 'click', handleNavClick.bind(this));
        });
    }
}

/* *************************************************************************** #
#   * Event callbacks :                                                        #
# *************************************************************************** */

/* === handleNavClick : ===================================================== */
async function handleNavClick(event) {

    const navItem = event.currentTarget;
    const navItems = this.shadowRoot.querySelectorAll('.nav-item');


    navItems.forEach(item => item.classList.remove('selected'));
    navItem.classList.add('selected');

    const background = navItem.querySelector('.nav-background');
    background.style.animation = 'none';
    void background.offsetWidth;
    setTimeout(() => background.style.animation = '', 10);
    await Router.handleRouting.call(this, event);
}
