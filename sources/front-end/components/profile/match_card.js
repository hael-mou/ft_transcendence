import { Component } from "../../core/component.js";
import { Router } from "../../core/routing.js";

/* *************************************************************************** #
#   * MatchCard Component Class :                                             #
# *************************************************************************** */
export class MatchCard extends Component {

    /* == Constructor : ====================================================== */
    constructor(date, match, profile)
    {
        super();
        this.matchData = match;
        this.dateString = date;
        this.profileData = profile;
        this.opponentData = match.opponent;

        const [winnerScore, loserScore] = match.scores
            .split(':')
            .map(Number);
        this._myScore = match.status === 'win' ? winnerScore : loserScore;
        this.opponentScore = match.status === 'win' ? loserScore : winnerScore;
    }


    /* === onConnected : ==================================================== */
    onConnected() {
        const imgs = this.shadowRoot.querySelectorAll('img');
        const avatarPlayer = this.shadowRoot.getElementById('avatar-player');
        const avatarOpponent = this.shadowRoot.getElementById('avatar-opponent');

        this.addEventListener(avatarPlayer, 'click', Router.handleRouting.bind(this));
        this.addEventListener(avatarOpponent, 'click', Router.handleRouting.bind(this));
        imgs.forEach(img => {
            img.onerror = () => {
                img.src = '/static/assets/imgs/user_avatar.png';
            };
        });
    }


    /* === getMyScore : ========================================================= */
    get myScore() {
        return this._myScore;
    }

    /* === Template: ======================================================== */
    get template() {
        return /* html */ `
            <div class="match-card">

                <div class="player-card d-flex justify-content-center align-items-center
                     ${this._myScore > this.opponentScore? 'winner' : 'loser'}">

                    <img src="${this.profileData.avatar}" alt="User Avatar"
                        id="avatar-player" class="player-avatar"
                        data-link='/profile?id=${this.profileData.id}'>
                    <span class="player-score">${this._myScore}</span>
                </div>

                <div class="vs-container d-flex flex-column justify-content-center align-items-center">
                    <span class="match-date">${this.dateString}</span>
                    <span class="vs"><i>VS</i></span>
                    <span class="match-date">match</span>
                </div>

                <div class="player-card d-flex justify-content-center align-items-center
                        ${this._myScore < this.opponentScore ? 'winner' : 'loser'}">
                    <span class="player-score">${this.opponentScore}</span>
                    <img id="avatar-opponent" src="${this.opponentData.avatar}"
                        alt="opponent Avatar" class="player-avatar"
                        data-link='/profile?id=${this.opponentData.id}'>
                </div>
            </div>
        `;
    }

    /* === Styles: ========================================================== */
    get styles() {
        return /* css */ `
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            img {
                cursor: pointer;
            }

            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 380px;
                height: 100%;
                overflow-x: hidden;
                padding: 10px;
                border-radius: 8px;
            }

            .match-card {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 34px;
                background-color: #555555;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                width: 100%;
                max-width: 600px;
                text-align: center;
            }

            .player-card {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                width: 30%;
                color: #fff;
            }

            .player-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #333;
                transition: transform 0.3s ease;
            }

            .player-avatar:hover {
                transform: scale(1.1);
            }

            .player-score {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
            }

            .vs-container {
                gap: 5px;
                color: #fff;
            }

            .vs {
                font-size: 24px;
                font-weight: bold;
                font-style: italic;
                color: #f7f7f7;
            }

            .match-date {
                font-size: 14px;
                color: #888;
            }

            .loser {
                filter: grayscale(1) opacity(0.7);
            }

            .winner .player-avatar {
                border-color: #28a745;
            }

            .loser .player-avatar {
                border-color: #dc3545;
            }

            @media (max-width: 1300px) {
                .player-avatar {
                    width: 55px;
                    height: 55px;
                }

                .player-score {
                    font-size: 16px;
                }

                .vs {
                    font-size: 20px;
                }

                .match-date {
                    font-size: 12px;
                }

                .match-card {
                    padding: 20px;
                }

                .vs-container {
                    gap: 3px;
                }
            }

            @media (max-width: 1180px) {
                .player-avatar {
                    width: 50px;
                    height: 50px;
                }

                .player-score {
                    font-size: 14px;
                }

                .vs {
                    font-size: 18px;
                }

                .match-date {
                    font-size: 10px;
                }

                .match-card {
                    padding: 15px;
                }

                .vs-container {
                    gap: 2px;
                }
            }

            @media (max-width: 450px) {
                .player-avatar {
                    width: 40px;
                    height: 40px;
                }

                .player-score {
                    font-size: 12px;
                }

                .vs {
                    font-size: 16px;
                }

                .match-date {
                    font-size: 8px;
                }

                .match-card {
                    padding: 10px;
                }

                .vs-container {
                    gap: 1px;
                }
            }
        `;
    }
}
