import { Component } from "../../core/component.js";
import { TournamentCard } from "./tournament-card.js";
import { tournamentGateway } from "../../core/config.js";
import { Http } from "../../tools/http.js";

/* *************************************************************************** #
#   * Tournament page Class :                                               #
# *************************************************************************** */

export class Tournaments extends Component {
    /* === Constructor: ===================================================== */
    constructor() {
      super();
      this.tournaments = [];
    }

  /* === Init: ============================================================ */
  	async init() {
		const tournamentUrl = tournamentGateway.getTournamentsUrl;
		const response = await Http.getwithAuth(tournamentUrl);
		this.tournaments = response.json || [];

		const hasTournamentUrl = tournamentGateway.getMyTournamentUrl;
		const hasTournamentResponse = await Http.getwithAuth(hasTournamentUrl);
		this.has_tournament = !!hasTournamentResponse.json
	}

	/* === Render: ========================================================== */
	render() {
		super.render();
		const tournamentsList = this.shadowRoot.getElementById("tournament-list");
		
		this.tournaments.forEach((tournament) => {
			const div = document.createElement("div");
			const full = tournament.n_players >= tournament.max_players;
			if (full) return ;

			div.classList.add("swiper-slide");
			const tournamentCard = new TournamentCard(tournament);
			div.appendChild(tournamentCard);
			tournamentsList.appendChild(div);
		});
	}

  	/* === Template : ======================================================= */
  	get template() {
		return /* html */ `
		<h2 class="tournament-header">Tournaments</h2>
		<h4 class="tournament-subheader">Join or Create Your Tournament</h4>
		
		<div class="swiper mySwiper tournament-swiper">
			<div id="tournament-list" class="swiper-wrapper"></div>
			<div id="nextBtn" class="swiper-button-next"></div>
			<div id="prevBtn" class="swiper-button-prev"></div>
		</div>
			<div id="create-form" class="create-tournament-form">
			<input type="text" id="tournament-name" placeholder="Tournament Name"  
			       class="${this.has_tournament ? 'd-none' : ''}" required/>
			<button id="submit-btn" class="submit-btn ${this.has_tournament ? 'd-none' : ''}">Create</button>
			<button id="leave-btn" class="submit-btn ${this.has_tournament ? '' : 'd-none'}">leave</button>
			</div>
		</div>
		`;
  	}

  	/* === Styles : ======================================================== */
  	get styles() {
    return /* css */ `
        @import url("https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css");
        @import url("/static/assets/styles/common-style.css");
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

        .tournament-header {
            font-size: 2.5rem;
            font-family: fantasy, sans-serif;
            margin-bottom: 10px;
        }

        .tournament-subheader {
            font-size: 1.25rem;
            color: #bbb;
            margin-bottom: 30px;
            font-family: fantasy, sans-serif;
        }

        .swiper {
            width: 100%;
            max-width: 1200px;
            padding: 20px 0;
            position: relative;
        }

        .swiper-slide {
            width: min(600px, 100%);
            height: 400px;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            background-color: #444;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease-in-out;
            cursor: pointer;
        }

        .create-tournament-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
            padding: 20px;
            max-width: 400px;
            width: 100%;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 16px;
			box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(3.6px);
			-webkit-backdrop-filter: blur(6px);
			border: 1px solid rgba(255, 255, 255, 0.01);
			transition: 0.4s ease-out;
        }

        .create-tournament-form input {
            width: 95%;
            padding: 12px;
            margin: 10px 0;
            border-radius: 8px;
            border: none;
            font-size: 1rem;
        }

        .submit-btn {
            padding: 12px;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s ease;
			min-height: 3rem;
			margin: 0.5rem;
			outline: none;
			font-weight: 600;
			background: rgba(255, 255, 255, 0.25);
			background-color: rgba(255, 255, 255, 0.25);
			box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			border-radius: 10px;
			border: 1px solid rgba(255, 255, 255, 0.18);
			color: #F0F8FF;
        }
		.submit-btn:hover {
			background-color: rgba(30, 144, 255, 0.5);
		}
		
		.d-none {
			display: none !important;
		}
        `;
  	}

	/* === Init Swiper: ===================================================== */
	initSwiper() {
		const swiperEl = this.shadowRoot.querySelector('.swiper');
		return new Swiper(swiperEl, {
			spaceBetween: 10,
			slidesPerView: 'auto',
			centeredSlides: true,
			effect: 'coverflow',
			grabCursor: true,
			coverflowEffect: 
			{
				rotate: 50,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows: true,
			},
			centeredSlides: true,
			initialSlide: this.tournaments.length > 1 ? 1 : 0,
		});
	}

	/* === onConnect : ===================================================== */
	onConnected() {
		this.swiper = this.initSwiper();
		this.setupEventListeners();
	}

	setupEventListeners() {
		const nextButton = this.shadowRoot.getElementById('nextBtn');
		const prevButton = this.shadowRoot.getElementById('prevBtn');
		const submitButton = this.shadowRoot.getElementById('submit-btn');
		const leaveButton = this.shadowRoot.getElementById('leave-btn');

		this.addEventListener(nextButton, 'click', () => {
			this.swiper.slideNext();
		});
		this.addEventListener(prevButton, 'click', () => {
			this.swiper.slidePrev();
		});
		this.addEventListener(submitButton, 'click', async (event) => {
			event.preventDefault();
			const name = this.shadowRoot.getElementById('tournament-name').value;
			if (!name) return
			await addTournament.call(this, name);
		});

		this.addEventListener(leaveButton, 'click', async (event) => {
			event.preventDefault();
			await leaveTournament.call(this);
		});

		const tournamentsList = this.shadowRoot.getElementById("tournament-list");
		this.addEventListener(tournamentsList, 'click', async (event) => {
			if (event.target.tagName === 'TOURNAMENT-CARD') {
				const headers = { 'Content-Type': 'application/json' };
				const url = tournamentGateway.joinTournamentUrl;
				const id = parseInt(event.target.id);

				const body = JSON.stringify({ tournament_id: id });
				const response = await Http.postwithAuth(url, headers, body);
				if (!response.info.ok) {
					const alert = document.createElement('custom-alert');
					alert.setMessage(response.json["error"]);
					return alert.modalInstance.show();
				}
				
				const leaveButton = this.shadowRoot.getElementById('leave-btn');
				const submitButton = this.shadowRoot.getElementById('submit-btn');
				const textForm = this.shadowRoot.getElementById('tournament-name');
		
				leaveButton.classList.remove('d-none');
				submitButton.classList.add('d-none');
				textForm.classList.add('d-none');
			}
		});
	}

}
	/* ========== Helper Function: ============================================================*/
	async function addTournament(tournamentName) {
		const url = tournamentGateway.createTournamentUrl;
		const headers = { 'Content-Type': 'application/json' };
		const body = JSON.stringify({ name: tournamentName });

		const response = await Http.postwithAuth(url, headers, body);
		if (!response.info.ok) {
			const alert = document.createElement('custom-alert');
			alert.setMessage(response.json["error"]);
			return alert.modalInstance.show();
		}
		const tournamentsList = this.shadowRoot.getElementById("tournament-list");
		const newTournament = { name: tournamentName, n_players: 1, max_players: 4, full: false };
		const div = document.createElement("div");
		div.classList.add("swiper-slide");
		const tournamentCard = new TournamentCard(newTournament);
		div.appendChild(tournamentCard);
		tournamentsList.appendChild(div);
		this.swiper.update();

		const leaveButton = this.shadowRoot.getElementById('leave-btn');
		const submitButton = this.shadowRoot.getElementById('submit-btn');
		const textForm = this.shadowRoot.getElementById('tournament-name');

		leaveButton.classList.remove('d-none');
		submitButton.classList.add('d-none');
		textForm.classList.add('d-none');
	}

	/* ========== Helper Function: ============================================================*/
	async function leaveTournament() {
		const url = tournamentGateway.leaveTournamentUrl;
		const response = await Http.getwithAuth(url);
		
		const leaveButton = this.shadowRoot.getElementById('leave-btn');
		const submitButton = this.shadowRoot.getElementById('submit-btn');
		const textForm = this.shadowRoot.getElementById('tournament-name');

		leaveButton.classList.add('d-none');
		submitButton.classList.remove('d-none');
		textForm.classList.remove('d-none');
	}