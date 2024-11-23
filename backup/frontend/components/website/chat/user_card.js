
import { Component } from "../../../core/component.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class UserCard  extends Component
{
    /* === Constructor : =================================================== */
    constructor(user, messages)
    {
        super();
        this.user = user || {
                                avatar: "/static/assets/imgs/user_avatar.png",
                                username: "Unonymous"
                            };

        this.messages = messages || [];
    }

    /* === Template : ====================================================== */
    get template()
    {
        return /* html */ `
            <div class="card-container">
                <img src="${this.user.avatar}" alt="User Avatar">
                <div class="card-content">

                    <div class="user-info">
                        <h3>${this.user.username}</h3>
                        <span class="online">Online</span>
                    </div>
                    <span class="new-message">2</span>
                </div>
            </div>
        `;
    }

    /* === styles : ======================================================== */
    get styles()
    {
        return /* css */ `
            :host {
                display: flex;
                align-items: center;
                border-radius: 10px;
                padding: 5px 10px;
                margin-bottom: 30px;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .card-container {
                display: flex;
                align-items: center;
                border-radius: 10px;
                width: 100%;
                margin-bottom: 1px;
                background: rgb(255 255 255 / 3%);
                padding: 0 0 10px 10px;
            }

            .card-container img {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                object-fit: cover;
                margin: 7px 10px 0px 4px;
                background-color: #fff;
                box-shadow: inset 0 0 3px 0px #fff;
            }

            .card-container:hover {
                background: rgb(255 255 255 / 5%);
                box-shadow: inset 0 0 3px 0px #fff;
            }

            .card-content {
                display: flex;
                justify-content: space-between;
                align-items: start;
                width: 100%;
            }

            .card-content h3 {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
            }


            .user-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 5px;
            }

            .online {
                font-size: 12px;
                color: #00c853;
                background-color: rgba(0, 200, 83, 0.1);
                padding: 3px 6px;
                border-radius: 12px;
                width: fit-content;
            }

            .new-message {
                font-size: 12px;
                font-weight: 600;
                text-shadow: 0 0 4px black;
                color: #fff;
                background-color: #04babd;
                padding: 4px 0 0 0;
                border-radius: 0 10px 0 50%;
                aspect-ratio: 1 / 1;
                width: 28px;
                text-align: center;
            }
        `;
    }

    /* === new Message : =================================================== */
    newMessage(new_message)
    {
        this.messages.push(new_message);
    }

    /* === change Status : ================================================= */
    updateStatus(isOnline = true)
    {
        console.log("updateStatus", isOnline);
    }
}
