import { Component } from "../../core/component.js";
import { profileGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Http } from "../../tools/http.js";
import { MatchCard } from "./match_card.js";
import { FriendCard } from "./friend_card.js";

/* *************************************************************************** #
#   * Profile Component Class :                                               #
# *************************************************************************** */
export class Profile extends Component
{
	/* === Constructor : ===================================================================================== */
	constructor(){
		super();
		this.user_id = 2;
		// this.defaultProfile = {
		// 	first_name: "Si",
		// 	last_name: "Brahim",
		// 	username: "AllezSiBrahim",
		// 	avatar: "https://i.pravatar.cc/150?img=69",
		// }
		// this.buttonStatus = {
		// 	"Add friend": {
		// 		classToAdd:  "add-friend",
		// 		classToremove: ["remove-friend", "cancel-friend"],
		// 		iconSrc: "/static/assets/images/add.svg",
		// 		buttonText: "Add friend",
		// 		callBack: addFriend.bind(this),
		// 	},
		// 	"Remove friend": {
		// 		classToAdd:  "remove-friend",
		// 		classToremove: ["add-friend", "cancel-friend"],
		// 		iconSrc: "/static/assets/images/remove.svg",
		// 		buttonText: "Remove friend",
		// 		callBack: removeFriend.bind(this),
		// 	},
		// 	"Cancel": {
		// 		classToAdd:  "cancel-friend",
		// 		classToremove: ["add-friend", "remove-friend"],
		// 		iconSrc: "/static/assets/images/cancel.svg",
		// 		buttonText: "Cancel",
		// 		callBack: cancelRequest.bind(this),
		// 	},
		// }
	}

	/* === Init : ============================================================================================ */
	async init() {
		const friendsUrl = profileGateway.getFriendsUrl;
		const profileUrl = `${profileGateway.getProfileUrl}?id=${this.user_id}`;
		const receivedRequestsUrl = profileGateway.getReceivedRequestsUrl;
		const matchesHistoryUrl = profileGateway.getMatchesHistoryUrl;

		const sentRequestsUrl = profileGateway.getSentRequestsUrl;
		this.friendRequests = [];
		this.SentFriendRequests = [];

		this.profile = (await Http.get(profileUrl)).json[0] || this.defaultProfile;
		this.friends = (await Http.get(friendsUrl)).json["friends"] || [];
		const receivedRequestsResponse = (await Http.get(receivedRequestsUrl)).json || [];

		receivedRequestsResponse.forEach(request => {
			this.friendRequests.push(request.sender_profile);
		});

		this.matches = (await Http.get(matchesHistoryUrl)).json || {};
		console.log("---------->>", this.matches);
		const response = (await Http.get(sentRequestsUrl)).json;
		response.forEach(request => {
			this.SentFriendRequests.push(request.receiver_profile);
		});
	}

	/* === Render : ========================================================================================== */
	render() {
		super.render();

		const friend_cards = this.shadowRoot.getElementById("friends-cards");
		const requests_cards = this.shadowRoot.getElementById("request-cards");
		const matches_cards = this.shadowRoot.getElementById("matches-cards");
		if (this.friends.length) {
			this.friends.forEach(friend => {
				const friendCard = new FriendCard(friend, false);
				friendCard.classList.add("list-group-item");
				friend_cards.appendChild(friendCard);
			});
		}
		if (this.friendRequests.length) {
			this.friendRequests.forEach(request => {
				const requestCard = new FriendCard(request, true);
				requestCard.classList.add("list-group-item");
				requests_cards.appendChild(requestCard);
			});
		}

		let results = {};
		this.wins = [];
		this.loses = [];
		Object.entries(this.matches).forEach(([date, matchesInDay]) => {
			results[date] = {wins: 0, losses: 0};
			matchesInDay.forEach(match => {
				const matchCard = new MatchCard(date, match, this.profile);
				matchCard.classList.add("list-group-item", "d-flex", "justify-content-between");
				matches_cards.appendChild(matchCard);
				match.status === "win" ? results[date].wins++ : results[date].losses++;
			})
				const dayIndex = new Date(date).getDay() - 1;
				if (this.wins.length < 7 && this.loses.length < 7) {
					this.wins[dayIndex] = results[date].wins;
					this.loses[dayIndex] = results[date].losses;
				}
		});
		this.wins = [...this.wins.slice(-7)].map(value => value === undefined ? 0 : value);
		this.loses = [...this.loses.slice(-7)].map(value => value === undefined ? 0 : value);
		const isAlreadyFriend = this.friends.some(friend => friend.id === this.profile.id);
		if (isAlreadyFriend) {
			this.updateButtonStatus("Remove friend");
		}
		const isAlreadySentRequest = this.SentFriendRequests.some(request => request.id === this.profile.id);
		if (isAlreadySentRequest) {
			this.updateButtonStatus("Cancel");
		}
	}

	/* === UpdateButtonStatus : ============================================================================== */
	// updateButtonStatus(status)
	// {
	// 	const button = this.shadowRoot.getElementById('friend-button');
	// 	const statusInfo = this.buttonStatus[status];
	// 	button.classList.remove(...statusInfo.classToremove);
	// 	button.classList.add(statusInfo.classToAdd);
	// 	button.querySelector("img").setAttribute("src", statusInfo.iconSrc);
	// 	button.querySelector("span").textContent = statusInfo.buttonText;
	// }
	/* === template : ======================================================================================== */
	get template()
	{
		return /* html */ `
		<div class="container-fluid">
				<div class="header-banner position-relative d-flex justify-content-center align-items-end">
					<img src=${this.profile.avatar} alt="User Avatar" class="profile-avatar img-fluid">
				</div>
				<div class="mt-5 py-4 bg-red text-whiter">
					<div class="container">
						<div class="row p-0">
							<div class="col-12 mb-3 text-center">
								<span class="d-block name">${this.profile.first_name || Anonymous } ${this.profile.last_name || player}</span>
								<span class="d-block username">${this.profile.username}</span>
							</div>
						</div>
						<div class="row p-0">
							<div class="col-12 text-md-end">
								<div class="info-buttons d-flex justify-content-center flex-column flex-md-row">
									<button id="friend-button" class="mybutton add-friend-button" ac="addFriend">
										<img src="/static/assets/imgs/google_icon.svg" alt="Add Friend Icon" class="add-friend-icon">
										<span class="add-friend-span">Add friend</span>
									</button>
									<button id="message-button" class="mybutton message-button">
										<img src="/static/assets/imgs/google_icon.svg" alt="Message Icon">
										<span>Message</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row mt-4 p-0">
					<div class="profile-info col-12 col-md-9">
						<div class="row p-0 ">
							<div class="col-14  mb-3">
							<div class="card">
								<div class="card-header">
									<h5>Performance Chart</h5>
								</div>
								<div class="card-body">
									<div id="chart-container">
										<canvas id="myChart" style="width:100%;background-color: black"></canvas>
									</div>
								</div>
							</div>
						</div> <!---- END of Performance Chart ---->
							<div class="col-12  mb-3">
								<div class="card">
									<div class="card-header">
										<h5>Wins & Losses</h5>
									</div>
									<ul id="matches-cards" class="matches-container list-group list-group-flush"></ul>
								</div>
							</div> <!---- END of List of wins and loses ---->
						</div> <!---- END of Row ---->
						<div class="py-4 mt-5 bg-dark text-whiter">
							<div class="container">
								<div class="row p-0 justify-content-center text-center">
									<div class="col-12 col-md-6 mb-3 mb-md-0">
										<p>&copy; Pingo Pingo 2024 - 1337</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="friends-list col-12 col-md-3">
						<div class="card mb-3">
							<div class="card-header">
								<h5>Friends</h5>
							</div>
							<ul id="friends-cards" class="list-group list-group-flush"></ul>
						</div> <!--Friend ENd-->
						<div class="card mb-3">
							<div class="card-header">
								<h5>Friend Requests</h5>
							</div>
						</div>
						<ul id="request-cards" class="list-group list-group-flush"></ul>
					</div>
				</div> <!---- END of Main Content---->
		</div> <!---- END of Profile ---->
	`;
	}
	/* === styles : =========================================================================================== */
	get styles() {
		return /* css */ `
			@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
			@import url("/static/assets/styles/common-style.css");

			:host {
				font-family: 'Exo2', sans-serif;
				color: var(--color-text);
				width: 100%;
			}
			.container{
				padding: 0px;
			}

			.header-banner {
				width: 100%;
				height: 230px;
				position: relative;
				border-radius: 30px;
				background: url("/static/assets/imgs/banner.jpg") lightgray 50% / cover no-repeat;
				margin-bottom: 4.5rem;
			}

			.profile-avatar {
				position: absolute;
				transform: translateX(-50%);
				bottom: -60px;
				left: 50%;
				width: 120px;
				height: 120px;
				border-radius: 50%;
				background: lightgray 50% / cover no-repeat;
			}
			.friend-avatar, .player-avatar {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				background: 50% / cover no-repeat;
			}
			.list-group-item, .list-group-item:last-child{
				background-color: #313a42;
				border-radius: 20px;
				color: white;
				padding: 15px;
				overflow: hidden;
				transition: transform 0.2s ease;
			}

			.list-group-item:first-child, .list-group-item:last-child {
				border-top-left-radius: 20px;
				border-top-right-radius: 20px;
				border-bottom-right-radius: 20px;
				border-bottom-left-radius: 20px;

			}

			.list-group{
				background: transparent;
				color: white;
				padding: 1rem;
				gap: 15px;
				overflow: auto
			}

			.list-group-item:hover {
				transform: scale(1.02);
			}

			.border-success, .border-danger {
				border: 4px solid !important;
			}

			.mybutton span {
				font-family: 'Exo2', sans-serif;
				font-weight: 750;
				font-size: 1em;
				padding-right: 0.8rem;
			}

			.mybutton:hover {
				background-color: #ffffff82;
			}
			.mybutton{
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.5rem 0.5rem;
				border-radius: 10px;
				border: none;
				font-family: inherit;
				font-size: 1rem;
				font-weight: 600;
				cursor: pointer;
				transition: background-color 0.3s, transform 0.1s;
				margin-bottom: 10px;
				box-shadow: 0 0 12px 0px rgb(159 159 159 / 54%);
			}

			.mybutton img {
				margin-left: 12px;
			}

			.mybutton img {
				width: 24px;
				height: 24px;
				margin-right: 0.5rem;
			}
			.name {
				font-size: 1.6rem;
				font-weight: bold;
				color: #fff;
				margin-bottom: 5px;
			}

			.username {
				font-size: 1.2rem;
				color: #999;
				font-style: italic;
			}
			.info-buttons {
				column-gap: 20px;
			}

			.row {
				--bs-gutter-x: 0;
			}
			canvas{
				background-color: #19232ca1;
				border-radius: 20px;
				box-shadow: 0px 0px 31px 0px rgba(255, 255, 255, 0.47);
				padding: 27px;
			}
			@media (max-width: 1550px) {
				.profile-info {
				  display: flex;
				  flex-direction: column;
				}

				.profile-info .col-md-4, .profile-info .col-md-8 {
				  flex: 1 1 100%;
				}
			  }

			.remove-friend{
				background-color: #df1e14;
			}

			.cancel-friend{
				background-color: #b27300;
			}

			.add-friend{
				background-color: white;
			}

			@media (max-width: 576px) {
				.profile-avatar {
				  width: 80px;
				  height: 80px;
				  bottom: -50px;
				}
				.header-banner {
				  height: 150px;
				}
				.friend-list{
					width: 50%;
				}
			}
			.card{
				background: #19232c;
			}
		`
	};
	/* === data : ============================================================================================= */
	get chartData() {

			const data = {
				labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				datasets: [
				  {
					label: 'Loses',
					data: this.loses,
					borderColor: '#b5f542',
					backgroundColor: 'rgba(181, 245, 66, 0.2)',
					borderWidth: 3,
					tension: 0.4,
					fill: true,
				  },
				  {
					label: 'Wins',
					data: this.wins,
					borderColor: '#4287f5',
					backgroundColor: 'rgba(66, 135, 245, 0.2)',
					borderWidth: 3,
					tension: 0.4,
					fill: true,
				  }
				]
			  };
			 return data;
	}
	/* ==== ChartCOnfig : ====================================================================================== */
	get configData() {
			const config = {
				type: 'line',
				data: this.chartData,
				options: {
				  responsive: true,
				  plugins: {
					legend: {
					  labels: {
						color: 'white',
						font: {
						  size: 14
						}
					  },
					  position: 'bottom',
					},
					tooltip: {
					  callbacks: {
						label: function(tooltipItem) {
						  return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
						}
					  }
					}
				  },
				  scales: {
					x: {
					  ticks: {
						color: 'white',
					  },
					  grid: {
						color: 'rgba(255, 255, 255, 0.1)',
					  }
					},
					y: {
					  ticks: {
						color: 'white',
						callback: function(value) {
						  return value;
						}
					  },
					  grid: {
						color: 'rgba(255, 255, 255, 0.1)',
					  },
					  beginAtZero: true,
					}
				  }
				}
			  };
			  return config;
	}
	/* === connected: ========================================================================================== */
// 	onConnected()
// 	{
// 		this.alert = new Alert();
// 		const ctx = this.shadowRoot.getElementById('myChart').getContext('2d');
// 		const myLineChart = new Chart(ctx, this.configData);
// 		const friendButton = this.shadowRoot.getElementById('friend-button');
// 		this.addEventListener(friendButton, 'click', handleFriendButton.bind(this));
// 	}
}


// // /* === Event Handlers : ====================================================================================== */
// async function handleFriendButton(event) {
//     const buttonName = event.target.textContent.trim();

//     if (this.buttonStatus[buttonName]) {
//         const handler = await this.buttonStatus[buttonName].callBack(event);
//     } else {
//         console.error('Unknown button:', buttonName);
//     }
// }

// // addFriend
// async function addFriend(event) {
// 	event.preventDefault();

// 	const receiver_id = this.profile.id;
	// const requestUrl = profileGateway.addFriendRequestUrl;
// 	const requestHeaders = { 'Content-Type': 'application/json' };
// 	const requestData = JSON.stringify({ receiver_id });

// 	try {
// 		const response = await Http.post(requestUrl, requestHeaders, requestData);

// 		if (response["error"]) {
// 			this.alert.setMessage(response.error);
// 			this.alert.modalInstance.show();
// 		} else {
// 			this.updateButtonStatus("Cancel")
// 		}
// 	} catch (error) {
// 		console.error(error);
// 	}
// }


// //removeFriend
// async function removeFriend(event) {
// 	event.preventDefault();
// 	const friend_id = this.profile.id;
// 	const url = profileGateway.removeFriendUrl;
// 	const headers = { 'Content-Type': 'application/json' };
// 	const data = JSON.stringify({ friend_id });
// 	try{
// 		const response = await Http.post(url, headers, data);

// 		if (response["error"]) {
// 			this.alert.setMessage(response.error);
// 			this.alert.modalInstance.show();
// 		} else {
// 			this.updateButtonStatus("Add friend");
// 		}
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// // CancelRequest
// async function cancelRequest(event) {
// 	event.preventDefault();

// 	const receiver_id = this.profile.id;
// 	const requestUrl = profileGateway.cancelFriendRequestUrl;
// 	const requestHeaders = { 'Content-Type': 'application/json' };
// 	const requestData = JSON.stringify({ receiver_id });

// 	try {
// 		const response = await Http.post(requestUrl, requestHeaders, requestData);

// 		if (response["error"]) {
// 			this.alert.setMessage(response.error);
// 			this.alert.modalInstance.show();
// 		} else {
// 			this.updateButtonStatus("Add friend");
// 		}
// 	} catch (error) {
// 		console.error(error);
// 	}
// }
