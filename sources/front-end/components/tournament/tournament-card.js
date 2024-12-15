import { Component } from "../../core/component.js";
/* ***************************************************************************#
#   * TournamentCard Component Class :                                        #
# ****************************************************************************/
export class TournamentCard extends Component
{
    static pos = 0;

    /* == Constructor : ====================================================== */
    constructor(tournament)
    {
        super();
        console.log("tournament", tournament);
        this.tournament = tournament;
        this.name = tournament.name;
        this.n_players = tournament.n_players;
        this.max_players = tournament.max_players;
        this.id = tournament.id;
        this.full = this.n_players === this.max_players;
        this.backgrounds = [
            "https://cdn2.unrealengine.com/fneco-31-20-livelydomino-competitive-iconcup-blog-cup-inline-1920x1080-1920x1080-223b69218cb4.jpg",
            "https://trackercdn.com/unreal/27comp-in-game-rankedcups-tile-1920x1080-2-1920x1080-f34922049507.jpg",
            "https://external-preview.redd.it/bntGdcJEmthFvsPJb5a5mGalQKFnUH1skBI9s2iLkgc.jpg?width=1080&crop=smart&auto=webp&s=6309486bcb5bac83ff508214f9e0464d54efe970",
            "/static/assets/imgs/tournament1.jpg",
            "/static/assets/imgs/tournament2.jpg",
            "/static/assets/imgs/tournament3.jpg",
        ]
    }

    /* === template : ======================================================== */
    get template()
    {
        return /* html */ ` 
            <div class="d-flex align-items-center tournament-info flex-column">
                <img src="/static/assets/imgs/lock.svg"
                        alt="Tournament Icon"
                        class= "${this.full ? 'd-flex' : 'd-none'}">
                <span class="tournament-name" >${this.name}</span>
                <span class="tournament
                -players">${this.n_players}/${this.max_players}</span>
            </div>`
    }

    /* === Styles : ========================================================== */
    get styles()
    {
        return /* css */ `
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");

            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: sans-serif;
            }
            :host{
                display: flex;
                overflow: hidden;
                width: 100%;
                height: 100%;
                background-image: url(${this.backgrounds[TournamentCard.pos++ % this.backgrounds.length]});
                background-size: cover;
                background-position: center;
                border-radius: 10px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border: 10px solid white;
                box-sizing: border-box;
            }
            .tournament-info{
                padding: 10px;
                color: white
            }

            .tournament-name{
                font-weight: 900;
                font-size: 5.41rem;
                margin: 0;
                line-height: 1;
                text-shadow: 10px 2px 4px #000;
            }
            .tournament-players{
                font-size: 18px;
                color: #fff;
                text-shadow: 2px 2px 4px #000;
            }
  `}

}