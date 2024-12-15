import { Component } from "../../core/component.js";
import { TournamentCard } from "./tournament-card.js";

/* *************************************************************************** #
#   * Tournament page Class :                                               #
# *************************************************************************** */

export class TournamentMatch extends Component {
    /* === Constructor: ===================================================== */
    constructor() {
        super();
    }

    /* === init : ========================================================== */
    async init() {
        // get My tournament from backend
        // const myTournamentUrl = tournamentGateway.getMyTournamentUrl;
        // const response = await Http.get(myTournamentUrl);
        // this.tournament = response;
        this.tournament = {
            players: [
                {
                    name: "Player 1",
                    score: 0,
                },
                {
                    name: "Player 2",
                    score: 0,
                },
                {
                    name: "Player 3",
                    score: 0,
                },
                {
                    name: "Player 4",
                    score: 0,
                },
            ],
            id: 1,
            name: "Tournament 1",
            description: "This is a tournament",
            n_players: 4,
            max_players: 4,
            full: false,
        }
        this.players = this.tournament.players;
        this.tournamentId = this.tournament.id;
        this.tournamentName = this.tournament.name;
    }
    

    /* === template : ======================================================== */
    get template() {
        return /* html */ `
            <div id="bracketContainer">
            <div class="roundHeaderContainer">
                <h3>${this.tournamentName}</h3>
            </div>
            <div class="rounds">
                <div id="leftQuarterFinal">
                    <avatars-component></avatars-component>
                </div>
                <div id="final">
                    <avatars-component></avatars-component>
                </div>
                <div id="rightQuarterFinal">
                    <avatars-component></avatars-component>
                </div>
            </div>
        </div>
        `;
    }

    /* === Styles : ========================================================== */
    get styles() {
        return /* css */ `
        *{
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
        }
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;
            padding: 20px;
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
            color: #fff;
            box-sizing: border-box;
        }
      
        #bracketContainer {
            color: white;
            height: 80%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        #rightQuarterFinal avatars-component > #avatarsContainer {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
        }
        
        .roundHeaderContainer {
            width: 100%;
            text-align: center;
        }
        .rounds{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        @media (max-width: 1090px) {
            :host {
                padding: 10px;
            }

            #bracketContainer {
                height: auto;
                width: 100%;
            }

            #leftQuarterFinal, 
            #rightQuarterFinal {
                width: 100%;
            }

            .rounds {
                flex-direction: column;
            }

            #final {
                margin-top: 20px;
            }

            .roundHeaderContainer h3 {
                font-size: 1.5rem;
            }
        }

        @media (max-width: 480px) {
            .roundHeaderContainer h3 {
                font-size: 1.2rem;
            }

            #leftQuarterFinal,
            #rightQuarterFinal {
                width: 100%;
                flex-direction: column;
            }

            #final {
                margin-top: 10px;
            }
        }
        `;
    }
}