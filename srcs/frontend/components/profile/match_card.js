import { Component } from "../../core/component.js";

/* *************************************************************************** #
#   * MatchCard Component Class :                                             #
# *************************************************************************** */
export class MatchCard extends Component
{
    /* == Constructor : ====================================================== */
    constructor(date, match, profile)
    {
        super();
        console.log("MatchCard", date, match, profile);
        this.matchData = match;
        this.dateString = date;
        this.profileData = profile;
        this.opponentData = match.opponent;

        const [winnerScore, loserScore] = match.scores
            .split(':')
            .map(Number);
        this.myScore = match.status === 'win' ? winnerScore : loserScore;
        this.opponentScore = match.status === 'win' ? loserScore : winnerScore;
    }

    /* === template : ======================================================== */
    get template()
    {
        return /* html */ `
            <div class="player current-profile d-flex flex-column 
                        justify-content-center align-items-center">
                <img src="${this.profileData.avatar}" 
                    alt="User Avatar" 
                    class="player-avatar img-fluid
                    ${this.myScore > this.opponentScore? 'winner' : 'loser'}">
                <span class="me-2 player-score">${this.myScore}</span>
            </div>

            <div class="vs-container d-flex align-items-center 
                        flex-column justify-content-center">
                <span class="vs "><i>VS</i></span>
                <span class="date">${this.dateString}</span>
            </div>

            <div class="player rival d-flex flex-column 
                        justify-content-center align-items-center">
                <img src="${this.opponentData.avatar}}" 
                alt="User Avatar" 
                class="player-avatar img-fluid
                ${this.myScore < this.opponentScore ? 'winner' : 'loser'}">
                <span class="me-2 player-score">${this.opponentScore}</span>
            </div>
    ` }

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
            .player-avatar {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				background: 50% / cover no-repeat;
			}
            .player-score {
				font-size: 15px;
				font-weight: bold;
			}

			.vs-container {
				gap: 5px;
			}

			.vs {
				font-size: 24px;
				font-weight: bold;
				font-style: italic;
			}

			.date{
				font-size: 14px;
				color: #999;
			}
            .loser {
				filter: grayscale(1) opacity(0.5);
				box-shadow: 0 0 7px 5px #868686;
			}

			.winner {
				box-shadow: 0 0 3px 3px #fff;
			}
            .border-success, .border-danger {
				border: 4px solid !important;
			}
  `}
}