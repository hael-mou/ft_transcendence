
import { Component } from "../../core/component.js";
import { authGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Http } from "../../tools/http.js";
import { profileGateway } from "../../core/config.js"

/* *************************************************************************** #
#   * Settings Component Class :                                               #
# *************************************************************************** */
export class Settings extends Component
{
    constructor(){
        super();
        this.avatarSrc = localStorage.getItem('avatar');
    }

    /* === template : ======================================================= */
    get template()
    {
        return /* html */ `
        <div class="settings-container">
        <div class="header-banner position-relative d-flex justify-content-center align-items-end">
            <label class="outer">
                <input class="d-none" type="file" id="avatarInput" accept="image/*">
                <img id="profile-avatar" src="${this.avatarSrc}" class="profile-avatar"/>
                <div class="inner">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                    </div>
                </div>
            </label>
        </div>
        <nav class="mynav d-flex justify-content-center">
            ${this.navItems.map(navItem => /* html */ `
                <div class="nav-item ${navItem.active ? 'active' : ''}" data-nav="${navItem.name}" data-target="${navItem.name}-settings">
                    ${navItem.name}
                </div>
            `).join('')}
        </nav>

        <!---Main Content--->
        <section class="profile-settings" id="profile-settings">
            <form class="general-info-form">
                <div class="row mb-3 gy-3">
                    <div class="col-md-6">
                        <div class="input-container">
                            <img src="/static/assets/imgs/user_icon.svg" alt="first name Icon">
                            <input id="first_name_input" type="text" class="input-field"
                                placeholder="First Name">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="input-container">
                            <img src="/static/assets/imgs/user_icon.svg" alt="last name Icon">
                            <input id="last_name_input" type="text" class="input-field"
                                placeholder="Last Name">
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="input-container">
                            <img src="/static/assets/imgs/user_icon.svg" alt="last name Icon">
                            <input id="username_input" type="text" class="input-field"
                                placeholder="Username">
                        </div>
                    </div>
                </div>

                <button id="saveButton" type="submit" class="save-changes-btn">Save Changes</button>
            </form>
        </section>
        <security-settings id="security-settings" class="d-flex justify-content-center"></security-settings>
    </div>
    `
    };

    /* === navItems : ======================================================= */
    get navItems() {
        return [
            {
                name: 'profile',
                iconSrc: '/static/assets/imgs/user_avatar.png',
                iconAlt: "User avatar",
                active: true
            },
            {
                name: 'security',
                iconSrc: '/static/assets/imgs/email_icon.svg',
                iconAlt: "security icon",
                active: false
            },
            {
                name: 'game',
                iconSrc: '/static/assets/imgs/game_icon.svg',
                iconAlt: "game settings icon",
                active: false
            },
        ];
    }
    /* === style : ======================================================= */
    get styles() {
        return /* css */ `
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");

            :host {
                font-family: 'Exo2', sans-serif;
                color: var(--color-text);
                width: 100%;
            }

            .settings-container {
                width: 100%;
                height: auto;
                font-family: 'Exo2', sans-serif;
                background-color: #2c2c2c;
                border-radius: 20px;
                overflow: hidden;
                min-height: 100%;
                display: flex;
                flex-direction: column;
                gap: 2.5rem;
            }

            .profile-banner {
                height: 250px;
                background-color: #333;
                border-bottom: 1px solid #fff;
            }

            .banner-img {
                object-fit: cover;
                height: 100%;
                width: 100%;
            }

            .profile-avatar {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: lightgray 50% / cover no-repeat;
            }
            .mynav {
                background: #007189;
                padding: 10px;
                width: min(500px, 100%);
                border-radius: 54px;
                color: white;
                align-self: center;
                margin-top: 50px;
            }

            .nav-item{
                height: 100%;
                width: 100%;
                cursor: pointer;
                text-align: center;
                padding: 10px 10px;
                font-size: large;
                font-weight: 500;
                transition: all .3s;
            }

            .nav-item:first-child{
                border-radius: 54px 0 0 54px;
            }

            .nav-item:last-child{
                border-radius: 0 54px 54px 0;
            }

            .nav-item:not(:last-child){
                border-right: 1px solid #ffffff3b;
            }

            .nav-item:hover{
                font-weight: 600;
            }

            .profile-settings {
                width: min(500px, 100%);
                align-self: center;
            }

            .save-changes-btn, .input-container {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem 0.5rem;
                border-radius: 14px;
                border: none;
                font-family: inherit;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.1s;
                margin-bottom: 10px;
                box-shadow: 0 0 12px 0px rgb(159 159 159 / 54%);
            }
    
            .input-container {
                box-sizing: border-box;
                background-color: rgba(255, 255, 255, 0.1);
                border: 2px solid var(--color-border);
                padding-left: 1.5rem;
            }

            .input-container img {
                width: 18px;
                height: 18px;
                margin-right: 0.5rem;
                margin-left: 12px;
            }

            .input-field {
                background-color: transparent;
                border: none;
                outline: none;
                color: white;
                font-size: 1rem;
                font-family: inherit;
                width: 100%;
                padding: 0 0.5rem;
            }
            .save-changes-btn {
                background-color: #007088;
                color: white;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: background-color 0.3s;
                margin-top: 1.5rem;
                width: 50%;
                margin-left: auto;
            }
            .save-changes-btn:hover {
                background-color: #005f74;
            }

            .active {
                box-shadow: inset 0 0 9px 5px #005061;
            }
            .outer{
                height:120px;
                width: 120px;
                transform: translateY(50%);
                position: relative;
                bottom: 0;
                right: 0;
            }
            .inner{
                background-color: #007189;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        `;
    };

    onConnected() {
        this.nav_items = this.shadowRoot.querySelectorAll('.nav-item');
        const saveChangesBtn = this.shadowRoot.getElementById('saveButton');
        const changeAvatarInput = this.shadowRoot.getElementById('avatarInput');

        this.nav_items.forEach(navItem => {
            this.addEventListener(navItem, 'click', handleNavClick.bind(this));
        });
        if (this.nav_items.length > 0) {
            this.nav_items[0].click();
        }

        this.addEventListener(saveChangesBtn, 'click', saveChanges.bind(this));
        this.addEventListener(changeAvatarInput, 'change', changeAvatar.bind(this));
    }
}


/* === HandleNavClick ================================================ */
function handleNavClick(event) {
    const clickedNavItem = event.currentTarget;
    const targetContentId = clickedNavItem.getAttribute('data-target');

    this.nav_items.forEach(item => {
        item.classList.remove('active');
    });
    clickedNavItem.classList.add('active');

    const contentItems = this.shadowRoot.querySelectorAll('[id$="-settings"]');
    contentItems.forEach(content => {
        if (content.id === targetContentId) {
            content.classList.remove('d-none');
        } else {
            content.classList.add('d-none');
        }
    });
}


/* === SaveChanges ================================================ */
async function saveChanges(event) {
    event.preventDefault();

    const alert = document.createElement('custom-alert');
    const firstNameInput = this.shadowRoot.getElementById('first_name_input').value;
    const lastNameInput = this.shadowRoot.getElementById('last_name_input').value;
    const usernameInput = this.shadowRoot.getElementById('username_input').value;

    if (!firstNameInput && !lastNameInput && !usernameInput) {
        alert.setMessage("Nothing to save");
        alert.modalInstance.show();
        return;
    }

    const headers = { 'Content-Type': 'application/json' };
    const profileData = JSON.stringify({ first_name: firstNameInput, last_name: lastNameInput, username: usernameInput });
    try {
        if (usernameInput) {
            const authResponse = await Http.patchwithAuth(authGateway.changeUsernameUrl,
                    headers, JSON.stringify({ username: usernameInput }));
            if (authResponse.info.ok) {
                const profileResponse = await Http.patchwithAuth(profileGateway.myProfileUrl,
                    headers, profileData);
                if (profileResponse.info.ok) {
                    alert.setMessage("Changes saved");
                } else {
                    alert.setMessage("Failed to update profile, try later");
                }
            } else {
                alert.setMessage("Failed to change username, try later");
            }
        } else {
            const profileResponse = await Http.patchwithAuth(profileGateway.myProfileUrl, headers, profileData);
            if (profileResponse.info.ok) {
                alert.setMessage("Changes saved");
            } else {
                alert.setMessage("Failed to update profile");
            }
        }
        
        alert.modalInstance.show();
    } catch (error) {
        console.error(error);
        alert.setMessage("An error occurred while saving changes, try later");
        alert.modalInstance.show();
    }
}

/* === ChangeAvatar ==================================================== */
async function changeAvatar(event) {
    event.preventDefault();
    const alert = document.createElement('custom-alert');
    const avatarInput = this.shadowRoot.getElementById('avatarInput');
    const AvatarImage = this.shadowRoot.getElementById('profile-avatar');

    AvatarImage.src = URL.createObjectURL(avatarInput.files[0]);

    const formData = new FormData();
    formData.append('avatar', avatarInput.files[0]);
    const url = profileGateway.myProfileUrl; 
    const headers = {};
    const response = await Http.patchwithAuth(url, headers, formData);
    if (!response.info.ok) {
        alert.setMessage(response.json["error"]); 
        return alert.modalInstance.show();
    }
    localStorage.setItem('avatar', response.json["avatar"]);
    alert.setMessage("Avatar changed successfully");
    alert.modalInstance.show();
}