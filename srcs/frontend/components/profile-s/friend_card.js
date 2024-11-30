
import { utils as  _  } from "../../tools/utils.js";
import { Component } from "../../core/component.js";
import { Router } from "../../core/routing.js";

/* ***************************************************************************#
#   * FriendCard Component Class :                                            #
# ****************************************************************************/
export class FriendCard extends Component
{
    /* == Constructor : ====================================================== */
    constructor(friend, isRequest) {
        super();
        this.friend = friend || {avatar: '/static/assets/imgs/user_avatar.png'};
        this.isRequest = isRequest || false;
    }

    /* == template : ======================================================== */
    get template() {
        return /* html */ `
            <div id="friend-card" class="friend-card d-flex align-items-center
                justify-content-between p-3">

                <div id="friend-info" class="d-flex align-items-center friend-info" data-link>
                    <img id="avatar" src=${this.friend.avatar} alt="User Avatar"
                         class="friend-avatar img-fluid" data-link>
                    <div class="friend-name d-flex justify-content-evenly
                                flex-column mx-2" data-link>
                        <span class="friend-name" data-link>${this.friend.first_name} ${this.friend.last_name}</span>
                        <span class="friend-username" data-link>${this.friend.username}</span>
                    </div>
                </div>

                <div class="button-container align-items-center flex-wrap px-auto gap-2 justify-content-center ${this.isRequest ? 'd-flex' : 'd-none'}">
                    <button class="btn btn-primary btn-sm ml-auto friend-request" id="accept-button">Accept</button>
                    <button class="btn btn-danger btn-sm ml-auto friend-request" id="reject-button">Reject</button>
                </div>

            </div>
        `;
    }

    /* == styles : ========================================================== */
    get styles() {
        return /* css */ `
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Exo2", sans-serif;
                font-size: 1rem;
            }

            :host{
                display: block;
                width: 100%;
                overflow: hidden;
            }

            .friend-card {
                background-color: #555555;
                height: auto;
                padding-right: 35px !important;
                padding-left: 35px !important;
            }

            .friend-card:hover {
                background-color: #444444;
            }

            .friend-card button {
                width: 100px;
                height: 40px;
                border-radius: 10px;
                color: white;
            }

            .friend-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: lightgray 50% / cover no-repeat;
            }
            .friend-username{
                font-size: 13px;
                color: #b4c2c9;
            }
            .first-name{
                font-size: 17px;
                color: #b4c2c9;
            }

            #friend-info {
                cursor: pointer;
            }

            @media (max-width: 1920px) {
                .friend-avatar {
                  width: 50px;
                  height: 50px;
                }

                .friend-card{
                    flex-direction: column;
                    gap: 10px;
                }

                .friend-info {
                    flex-direction: column;
                }

                .friend-name span:nth-child(2) {
                    display: none !important;
                }

            }

            @media (max-width: 1300px) {

                * {
                    font-size: 0.8rem;
                }

                .friend-avatar {
                    width: 40px;
                    height: 40px;
                }

                button {
                    width: 80px;
                    height: 30px;
                    font-size: 0.8rem;
                }
            }

            @media (max-width: 1180px) {

                * {
                    font-size: 0.7rem;
                }

                button {
                    width: 70px;
                    height: 25px;
                    font-size: 0.7rem;
                }
            }

            @media (max-width: 450px) {

                * {
                    font-size: 0.6rem;
                }

                .avatar {
                    width: 30px;
                    height: 30px;
                }

                button {
                    width: 50px;
                    height: 10px;
                    font-size: 0.6rem;
                }
            }

        `;
    }

    /* === OnConnected : ==================================================== */
    onConnected() {
        const avatar = this.shadowRoot.getElementById('avatar');
        const friend_info = this.shadowRoot.getElementById('friend-info');


        this.addEventListener(friend_info, 'click', async (event) => {
            event.target.href = `/profile?id=${this.friend.id}`;
            await Router.handleRouting(event);
        });

        avatar.onerror = () => {
            avatar.src = '/static/assets/imgs/user_avatar.png';
        };
    }
}
