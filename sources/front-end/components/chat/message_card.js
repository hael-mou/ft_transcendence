
import { Component } from "../../core/component.js";

/* *************************************************************************** #
#   * MessageCard Component Class :                                            #
# *************************************************************************** */

export class MessageCard extends Component {

    /* === constructor : ==================================================== */
    constructor(time, type, trackingNo)
    {
        super();
        this.tn   = trackingNo || '';
        this.time = time || "00:00";
        this.isSentByUser = type === 'sent' || false;
    }

    /* === Template : ====================================================== */
    get template()
    {
        return /* html */ `
            <div class="message-card ${this.isSentByUser ? 'sent' : 'received'}">
                <div class="message-content">
                    <slot></slot>
                </div>
                <div class="message-info">
                    <span class="time">${this.time}</span>
                </div>
            </div>
        `;
    }

    /* === Styles : ========================================================= */
    get styles()
    {
        return /* css */ `
            :host {
                display: flex;
                flex-direction: column;
                align-items: ${this.isSentByUser ? 'flex-end' : 'flex-start'};
                color: ${this.isSentByUser ? "#fff" : '#000'};
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            .message-card {
                width: min(70%, 600px);
                padding: 20px 30px 10px 20px;
                margin: 3px 15px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                background-color: ${this.isSentByUser ? "#05a8aa" : '#f1f1f1'};
                word-wrap: break-word;
            }

            .message-info {
                display: flex;
                justify-content: flex-end;
                font-size: 12px;
                color: ${this.isSentByUser ? "#fff" : '#999'};
                margin: 7px 0;
            }
        `;
    }
}
