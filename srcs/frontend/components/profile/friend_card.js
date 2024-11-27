import { Component } from "../../core/component.js";
import { Router } from "../../core/routing.js";
import { profileGateway } from "../../core/config.js";
import { Alert } from "../alert_component.js";
import { Http } from "../../tools/http.js";
import  { utils as _  } from "../../tools/utils.js";

/* ***************************************************************************#
#   * FriendCard Component Class :                                            #
# ****************************************************************************/
export class FriendCard extends Component
{
    /* == Constructor : ====================================================== */
    constructor(friend, isRequest)
    {
        super();
        this.friend = friend || {};
        this.isRequest = isRequest || false;
    }

    /* === template : ======================================================== */
    get template()
    {
        return /* html */ `
            <div id="friend-card" class="friend-card d-flex align-items-center
                       justify-content-between">    
                <div class="d-flex align-items-center friend-info">
                    <img src=${this.friend.avatar} alt="User Avatar"
                         class="friend-avatar img-fluid">   
                    <div class="friend-name d-flex justify-content-evenly
                                flex-column mx-2">
                        <span class="friend-name">${this.friend.first_name} ${this.friend.last_name}</span> 
                        <span class="friend-username">${this.friend.username}</span>
                    </div>
                </div>  
                <div class="button-container align-items-center flex-wrap px-auto gap-2 justify-content-center ${this.isRequest ? 'd-flex' : 'd-none'}">
                    <button class="btn btn-primary btn-sm ml-auto friend-request" id="accept-button">Accept</button>
                    <button class="btn btn-danger btn-sm ml-auto friend-request" id="reject-button">Reject</button>
                </div>
            </div>
        `
    }

    /* === Styles : ========================================================== */
    get styles()
    {
        return /* css */ `
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");
            :host{
                display: block;
                width: 100%;
                height: 100%;
                overflow-x: hidden;
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
            @media (max-width: 1500px) {
                .friend-avatar {
                  width: 50px;
                  height: 50px;
                }

                .friend-card{
                    flex-direction: column;
                }

                .friend-info {
                    flex-direction: column;
                }

                .friend-name span:nth-child(2) {
                    display: none !important;
                }
            }
  `}
    /* === onConnected : ===================================================== */
    onConnected()
    {
        const acceptButton = this.shadowRoot.getElementById('accept-button');
        const rejectButton = this.shadowRoot.getElementById('reject-button');
        this.addEventListener(acceptButton, 'click', handleAcceptButton.bind(this));
        // this.addEventListener(rejectButton, 'click', handleRejectButton.bind(this));
    }
}

    /* ==== Handle Accept Button : =============================================== */
    async function handleAcceptButton()
    {
        const friend_card = this.shadowRoot.getElementById('friend-card');
        const url = profileGateway.acceptFriendRequestUrl;
        const headers = { 'Content-Type': 'application/json' };
        const data = JSON.stringify({ sender_id: this.friend.id });

        const alert = new Alert();
        try {
            const response = await Http.post(url, headers, data); // post with auth
            if (response["error"])
                return (alert.setMessage(response["error"]), alert.modalInstance.show());
            friend_card.remove();
        } catch (error) {
            console.error(error); // for debugin purpose 
        }
    }

    // async function handleRejectButton()
    // {
    //     const friend_card = this.shadowRoot.getElementById('friend-card');
    //     const url = profileGateway.rejectFriendRequestUrl;
    //     const headers = { 'Content-Type': 'application/json' };
    //     const data = JSON.stringify({ sender_id: this.friend.id });

    //     try {
    //         const response = await Http.post(url, headers, data); // post with auth
    //         console.log("Response", response);
    //         if (response["error"])
    //             return (this.alert.setMessage(response["error"]), this.alert.modalInstance.show());

    //         friend_card.remove();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }