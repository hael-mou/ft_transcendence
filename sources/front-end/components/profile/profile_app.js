
import { profileGateway }  from "../../core/config.js";
import { Component } from "../../core/component.js";
import { utils as _ } from "../../tools/utils.js";
import { Router } from "../../core/routing.js";
import { FriendCard } from "./friend_card.js";
import { MatchCard } from "./match_card.js";
import { Http } from  "../../tools/http.js";
import { Auth } from "../../tools/http.js";

/* *************************************************************************** #
#   * Profile Component Class :                                                #
# *************************************************************************** */
export class ProfileApp extends Component {

    /* === constructor : ==================================================== */
    constructor() {

        super();
        this.friendShipStatus = {
			"none": {
				classToAdd:  "btn-primary",
				classToremove: ["btn-secondary"],
				buttonText: "Follow",
				callBack: addFriend.bind(this),
			},
			"friend": {
				classToAdd:  "btn-secondary",
				classToremove: ["btn-primary"],
				buttonText: "Unfollow",
				callBack: removeFriend.bind(this),
			},
			"sent_request": {
				classToAdd:  "btn-secondary",
				classToremove: ["btn-primary"],
				buttonText: "Cancel",
				callBack: cancelRequest.bind(this),
			},
            "recv_request": {
                classToAdd:  "btn-primary",
                classToremove: ["btn-secondary"],
                buttonText: "Accept",
                callBack: acceptRequest.bind(this),
            }
		}
    }


    /* === init : =========================================================== */
    async init() {

        try {
            const myId       = await Auth.getUserId();
            this.userId      = _.getQueryParams().id || myId;
            this.isMyProfile = (myId == this.userId);

            await this.loadProfile(),
            await Promise.all([
                this.loadMatches(),
                this.loadFriends(),
            ]);

            await this.loadFriendRequests();

        } catch (error) {
            console.error('Error initializing profile data:', error);
        }
    }


    /* === loadProfile : ==================================================== */
    async loadProfile() {

        const profileUrl = `${profileGateway.getProfileUrl}?id=${this.userId}`;
        const profileResponse = await Http.getwithAuth(profileUrl);
        this.profile  = profileResponse?.json[0] || undefined;

        if (!this.profile) {
            const myProfileUrl    = profileGateway.myProfileUrl;
            const profileResponse = await Http.getwithAuth(myProfileUrl);
            this.profile = profileResponse?.json;
            history.replaceState(null, null, "/profile");
            this.isMyProfile = true;
        }
    }


    /* === loadMatches : ==================================================== */
    async loadMatches() {

        const matchesUrl = `${profileGateway.getMatchesHistoryUrl}?id=${this.userId}`;
        const response   =  await Http.getwithAuth(matchesUrl);
        this.matches = response?.json || {};
    }


    /* === loadFriends : ===================================================== */
    async loadFriends() {

        const friendsUrl = profileGateway.getFriendsUrl;
        const response   = await Http.getwithAuth(friendsUrl);
        this.friends = response?.json?.friends || [];
    }


    /* === loadFriendRequests : ============================================= */
    async loadFriendRequests() {

        const recvRequestsUrl    = profileGateway.friendRequestUrl;
        const response           = await Http.getwithAuth(recvRequestsUrl);
        const FriendShipRequests = response?.json || [];
        const MyId               = await Auth.getUserId();

        const filteredRequests = FriendShipRequests.flatMap(request => {
            if (request.sender_profile.id == MyId)
            {
                return {status: "sender", info: request.receiver_profile};
            }
            else if (request.receiver_profile.id == MyId)
            {
                return {status: "receiver", info: request.sender_profile};
            }
            return [];
        });

        this.friendRequests = filteredRequests;
    }


    /* === getFriendshipStatus : ============================================ */
    getFriendshipStatus() {

        if (this.isMyProfile) return 'self';

        const friendship = this.friends.find(friend => friend.id == this.userId);
        if (friendship) return 'friend';

        const request = this.friendRequests.find(request => request.info.id == this.userId);
        if (request?.status == 'sender') return 'sent_request';
        if (request?.status == 'receiver') return 'recv_request';

        return 'none';
    }

    /* === template : ======================================================= */
    get template() {
        return /* html */ `
            <main class="container-fluid px-0 w-100 h-100">
                <!-- Profile Banner Section -->
                <div class="profile-banner position-relative">
                    <img src="/static/assets/imgs/banner.jpg" alt="Profile Banner"
                        class="banner-img img-fluid w-100">
                    <div class="position-absolute top-100 start-50 translate-middle">
                        <img id="avatar" src="/static/assets/imgs/user_avatar.png"
                            class="profile-avatar rounded-circle border border-5 border-light"
                            alt="Profile picture"
                        >
                    </div>
                </div>

                <!-- Profile Name Section -->
                <div class="profile-name text-center">
                    <h1 id="user-info" class="text-light">Anonymous</h1>
                    <h6 id="username" class="text-light">anonymous</h6>
                </div>

                <!-- Profile Buttons Section -->
                <div id="event-buttons" class="profile-buttons text-center">
                    <button id="friend-btn"  class="btn btn-primary mx-2">Follow</button>
                    <button id="message-btn" class="btn btn-secondary mx-2">Message</button>
                </div>

                <!-- profile Body Section-->
                <div class="profile-body d-flex flex-nowrap">

                    <!-- Content Section (Left) -->
                    <div id="contentt" class="content p-3">

                        <div id="statistics" class="w-100">
                            <h4 class="title mt-0">History Matches</h4>
                            <div class="stat-item">
                                <span>Games Played</span>
                                <span id="game-played">0</span>
                            </div>

                            <div class="stat-item">
                                <span>Win Rate</span>
                                <span id="win-rate">0%</span>
                            </div>

                            <div class="stat-item">
                                <span>Lose Rate</span>
                                <span id="lose-rate">0%</span>
                            </div>

                            <div class="stat-item">
                                <span>Highest Score</span>
                                <span id="highest-score">0</span>
                            </div>
                        </div>

                        <div id="matches-slider-show" class="match-slider w-100">
                            <h4 id="matches-title" class="title">History Matches</h4>
                            <div id="matches-list" class="match-slide">
                            </div>
                        </div>

                    </div>

                    <!-- Sidebar Section (right) -->
                    <div id="frend-nav" class="friend-nav h-100  text-white p-3 d-flex flex-column
                                overflow-hidden">

                        <h4 id="request-title" class="title mt-0">Friends request</h4>
                        <div class="overflow-x-hidden overflow-y-auto mh-50 user-friends"
                            id ="friend-requests">
                        </div>

                        <h4  id="friends-title" class="title mt-0">Friends list</h4>
                        <div class="overflow-x-hidden overflow-y-auto mh-50 user-friends"
                            id="friends-list">
                        </div>
                    </div>

                </div>

            </main>
        `;
    }


    /* === styles : ======================================================== */
    get styles() {
        return /*css*/`
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :host {
                display: block;
                width: 100%;
                height: auto;
                font-family: 'Exo2', sans-serif;
                background-color: #2c2c2c;
                border-radius: 20px;
                overflow: hidden;
                min-height: 100%;
            }

            .profile-banner {
                height: 250px;
                background-color: #333;
                border-bottom: 1px solid #fff;
            }

            .banner-img {
                object-fit: cover;
                height: 100%;
                width: 100%;
            }

            .profile-avatar {
                width: 130px;
                height: 130px;
                object-fit: cover;
                border: 1px solid #fff !important;
                background-color: #2c2c2c;
            }

            .profile-name {
                padding: 72px 0 0;
            }

            .profile-name h1 {
                font-size: 1.5rem;
                margin: 0;
            }

            .profile-name h6 {
                font-size: 1rem;
                margin: 0 !important;
            }

            .profile-buttons {
                padding: 10px 0;
            }

            .btn {
                font-size: 1rem;
                padding: 12px 30px;
                border-radius: 25px;
                text-transform: uppercase;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }

            .btn-primary {
                background-color: #368dec;
                border-color: #368dec;
                color: white;
            }

            .btn-primary:hover {
                background-color: #2477c1;
                border-color: #2477c1;
            }

            .btn-secondary {
                background-color: #555;
                border-color: #555;
                color: white;
            }

            .btn-secondary:hover {
                background-color: #444;
                border-color: #444;
            }

            .profile-body {
                padding: 9px;
                height: auto !important;
                width: 100% !important;
                column-gap: 9px;
            }

            .title {
                margin-top: 34px;
            }

            .friend-nav {
                width: 30%;
            }

            .content {
                flex: 1;
                height: 100% !important;
                color: white;
                max-width: 100%;
            }

            .mw-70 {
                max-width: 70% !important;
            }

            friend-card {
                margin-bottom: 9px;
                border-radius: 9px;
            }

            .stat-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 13px;
                font-size: 1.5rem;
                background-color: #555555;
                padding: 25px 73px;

                -webkit-mask: linear-gradient(to right, transparent,
                    white 1% , white 99% , transparent);
                mask: linear-gradient(to right, transparent,
                                white 1% , white 99% , transparent);
            }

            .user-friends {
                max-height: 277px !important;
                min-height: 100px !important;
                -webkit-mask: linear-gradient(to right, transparent,
                    white 3% , white 97% , transparent);
                mask: linear-gradient(to right, transparent,
                                white 3% , white 97% , transparent);
            }

            #friend-requests {
                margin-bottom: 34px;
            }

            .match-slide {
                color: white;
                display: flex;
                flex-wrap: nowrap;
                height: 156px;
                gap: 1rem;
                justify-content: center;
                overflow: hidden;
                -webkit-mask: linear-gradient(to right, transparent,
                    white 1% , white 99% , transparent);
                mask: linear-gradient(to right, transparent,
                                white 1% , white 99% , transparent);
            }

            .animateScroll {
                animation: scroLL 30s linear infinite;
            }

            @keyframes scroLL {
                to {
                    transform: translateX(-100%);
                }
            }

            @media (max-width: 1300px) {
                .profile-banner {
                    height: 200px;
                }

                .profile-avatar {
                    width: 100px;
                    height: 100px;
                }

                .profile-buttons {
                    padding: 8px 0 20px;
                }

                .btn {
                    font-size: 0.8rem;
                    padding: 8px 24px;
                }

                .profile-name {
                    padding: 54px 0 0;
                }

                .profile-name h1 {
                    font-size: 1.2rem;
                }

                .profile-name h6 {
                    font-size: 0.8rem;
                }

                .title {
                    margin-top: 24px;
                    font-size: 1.2rem;
                }

                #friend-requests {
                    margin-bottom: 24px;
                }

                .stat-item {
                    padding: 20px 55px;
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                }
            }

            @media (max-width: 1280px) {

                .profile-banner {
                    height: 140px;
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                }

                .profile-buttons {
                    padding: 6px 0 20px;
                }

                .btn {
                    font-size: 0.6rem;
                    padding: 6px 18px;
                    margin: 3px 2px !important;
                }

                .profile-name {
                    padding: 44px 0 0;
                }

                .profile-name h1 {
                    font-size: 1rem;
                }

                .profile-name h6 {
                    font-size: 0.6rem;
                }

                .profile-body {
                    flex-direction: column;
                    min-height: 0 !important;
                }

                .content {
                    min-width: 100% !important;
                }

                .friend-nav {
                    width: 100% !important;
                }

                .title {
                    margin-top: 24px;
                    font-size: 1rem;
                }

                #friend-requests {
                    margin-bottom: 24px;
                }

                .stat-item {
                    padding: 15px 40px;
                    font-size: 1rem;
                }

                .match-slide {
                    height: 117px;
                }
            }

            @media (max-width: 450px) {
                .profile-banner {
                    height: 85px;
                }

                .profile-avatar {
                    width: 45px;
                    height: 45px;
                }

                .profile-buttons {
                    padding: 0 0 10px;
                }

                .btn {
                    font-size: 0.4rem;
                    padding: 4px 12px;
                }

                .profile-name {
                    padding: 25px 0 0;
                }

                .profile-name h1 {
                    font-size: 0.8rem;
                }

                .profile-name h6 {
                    font-size: 0.4rem;
                }

                .title {
                    margin-top: 15px;
                    font-size: 0.8rem;
                }

                #friend-requests {
                    margin-bottom: 15px;
                }

                .stat-item {
                    padding: 10px 20px;
                    font-size: 0.8rem;
                }

                .match-slide {
                    height: 117px;
                }
            }
        `;
    }


    /* === render : ========================================================= */
    render() {
        super.render();
        this.updateProfile();
        this.updateMatches();
        this.updateStats();
        this.updateFrindNav();
    }


    /* === reRender : ======================================================= */
    async reRender() {
        await this.init();
        this.updateProfile();
        this.updateMatches();
        this.updateStats();
        this.updateFrindNav();
    }


    /* === Profile Update : ================================================= */
    updateProfile() {
        const avatar      = this.shadowRoot.getElementById('avatar');
        const userInfo    = this.shadowRoot.getElementById('user-info');
        const username    = this.shadowRoot.getElementById('username');
        const eventBtn    = this.shadowRoot.getElementById('event-buttons');
        const messageBtn  = this.shadowRoot.getElementById('message-btn');

        avatar.src = this.profile?.avatar || '/static/assets/imgs/user_avatar.png';
        userInfo.textContent = this.profile?.first_name || 'Anonymous';
        userInfo.textContent += " " +this.profile?.last_name || '';
        username.textContent = "@" +this.profile?.username || 'anonymous';
        eventBtn.classList.add('d-none');

        localStorage.setItem('avatar', avatar.src);
        if (this.isMyProfile) return ;
        const friendShip = this.getFriendshipStatus();
        this.updateFriendBtnStatus(friendShip);
        eventBtn.classList.remove('d-none');
        messageBtn.setAttribute('data-link', `/chat?room=${this.profile.id}`);
    }


    /* === Update Matches : ================================================= */
    updateMatches() {
        const matchesListTitle = this.shadowRoot.getElementById('matches-title');
        const matchesList = this.shadowRoot.getElementById('matches-list');

        matchesListTitle.classList.remove('d-none');
        matchesList.classList.remove('d-none');
        _.clear(matchesList);

        this.status = {wins: 0, losses: 0 , n_match: 0, highestScore: 0};
        Object.entries(this.matches).forEach(([date, matchesInDay]) => {
            matchesInDay.forEach(match => {
                const matchCard = new MatchCard(date, match, this.profile);
                matchCard.classList.add("animateScroll");
                matchesList.appendChild(matchCard);

                this.status.highestScore = Math.max(this.status.highestScore,
                                                     matchCard.myScore);

                match.status === "win" ? this.status.wins++
                                       : this.status.losses++;
                this.status.n_match++;
            });
        });

        if (this.status.n_match <= 2) {
            const elements = matchesList.querySelectorAll('.animateScroll');
            elements.forEach(element => {
                element.classList.remove('animateScroll');
            })
        }

        if (this.status.n_match) return;
        matchesListTitle.classList.add('d-none');
        matchesList.classList.add('d-none');
    }


    /* === Update Stats : =================================================== */
    updateStats() {
        const gamePlayed = this.shadowRoot.getElementById('game-played');
        const winRate = this.shadowRoot.getElementById('win-rate');
        const loseRate = this.shadowRoot.getElementById('lose-rate');
        const HighestScore = this.shadowRoot.getElementById('highest-score');

        gamePlayed.textContent = (this.status.n_match || 0) + " Matches";
        winRate.textContent = (this.status.wins / this.status.n_match * 100 || 0) + "%";
        loseRate.textContent = (this.status.losses / this.status.n_match * 100 || 0) + "%";
        HighestScore.textContent = this.status.highestScore + " pts";
    }


    /* === updateFrindNav : ================================================= */
    updateFrindNav() {

        const content = this.shadowRoot.getElementById('contentt');
        const frendNav = this.shadowRoot.getElementById('frend-nav');

        this.isMyProfile ? frendNav.classList.remove('d-none')
                         : frendNav.classList.add('d-none');

        this.isMyProfile ? content.classList.add('mw-70')
                         : content.classList.remove('mw-70');

        this.updateRequests();
        this.updateFrinds();

        if (!this.friends.length && !this.recevedRequests.length) {
            content.classList.remove('mw-70');
            frendNav.classList.add('d-none');
        }
    }


    /* === Update Requests : ================================================ */
    updateRequests() {
        const requestsListTitle = this.shadowRoot.getElementById('request-title');
        const requestList = this.shadowRoot.getElementById('friend-requests');

        requestsListTitle.classList.remove('d-none');
        requestList.classList.remove('d-none');
        _.clear(requestList);


        this.recevedRequests = this.friendRequests.filter(request =>
                                                   request.status === 'receiver'
                                                );

        if (!this.recevedRequests.length) {
            requestsListTitle.classList.add('d-none');
            requestList.classList.add('d-none');
            return;
        }


        this.recevedRequests.forEach(request => {
            requestList.appendChild(new FriendCard(
                request.info,
                true,
                FriendEventHandler.bind(this)
            ));
        });
    }


    /* === update Frinds : ================================================= */
    updateFrinds() {
        const friendsTitleElement = this.shadowRoot.getElementById('friends-title');
        const friendsListElement = this.shadowRoot.getElementById('friends-list');

        friendsTitleElement.classList.remove('d-none');
        friendsListElement.classList.remove('d-none');
        _.clear(friendsListElement);

        if (this.friends.length === 0) {
            friendsTitleElement.classList.add('d-none');
            friendsListElement.classList.add('d-none');
            return;
        }

        this.friends.forEach(friend => {
            const friendCard = new FriendCard(friend);
            friendsListElement.appendChild(friendCard);
        });
    }


    /* === updateFriendBtnStatus : ========================================== */
    updateFriendBtnStatus(status) {
		const button = this.shadowRoot.getElementById('friend-btn');
		const statusInfo = this.friendShipStatus[status];
		button.classList.remove(...statusInfo.classToremove);
		button.classList.add(statusInfo.classToAdd);
        button.textContent = statusInfo.buttonText;
        button.onclick = statusInfo.callBack;
	}

    /* === onConnected : =================================================== */
    onConnected() {

        const messageBtn  = this.shadowRoot.getElementById('message-btn');
        this.addEventListener(messageBtn, 'click', Router.handleRouting.bind(this));
    }

}


/* ************************************************************************** */
/*   * Event Handlers :                                                       */
/* ************************************************************************** */

/* === addFriend : ========================================================== */
async function addFriend(event) {

    event.preventDefault();
    const requestUrl = profileGateway.friendRequestUrl;
    const receiver_id = this.profile.id;
    const requestHeaders = { 'Content-Type': 'application/json' };
	const requestData = JSON.stringify({ receiver_id });

    const response = await Http.postwithAuth(requestUrl, requestHeaders, requestData);
    if (!response.info.ok) {
        const alert = document.createElement('custom-alert');
        alert.setMessage("something went wrong...");
        alert.modalInstance.show();
        return this.reRender();
    }

    this.friendRequests.push({status: "sender", info: this.profile});
    this.updateFriendBtnStatus('sent_request');
}


/* === cancelRequest : ======================================================= */
async function cancelRequest(event) {

    event.preventDefault();
    const receiver_id = this.profile.id;
	const requestUrl = profileGateway.cancelFriendRequestUrl;
	const requestHeaders = { 'Content-Type': 'application/json' };
	const requestData = JSON.stringify({ receiver_id });

    const response = await Http.postwithAuth(requestUrl, requestHeaders, requestData);
    if (!response.info.ok) {
        const alert = document.createElement('custom-alert');
        alert.setMessage("something went wrong...");
        alert.modalInstance.show();
        return this.reRender();
    }

    this.friendRequests = this.friendRequests
                    .filter(request => request.info.id !== receiver_id);
    this.updateFriendBtnStatus('none');
}

/* === removeFriend : ======================================================= */
async function removeFriend(event) {

    event.preventDefault();
    const friend_id = this.profile.id;
	const url = profileGateway.removeFriendUrl;
	const headers = { 'Content-Type': 'application/json' };
	const data = JSON.stringify({ friend_id });

    const response = await Http.postwithAuth(url, headers, data);
    if (!response.info.ok) {
        const alert = document.createElement('custom-alert');
        alert.setMessage("something went wrong...");
        alert.modalInstance.show();
        return this.reRender();
    }

    this.friends = this.friends.filter(friend => friend.id !== friend_id);
    this.updateFriendBtnStatus('none');
}

/* === acceptRequest : ======================================================= */
async function acceptRequest(event) {

    event.preventDefault();

    const url = profileGateway.acceptFriendRequestUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({ sender_id: this.profile.id });

    const response = await Http.postwithAuth(url, headers, data);
    if (!response.info.ok) {
        const alert = document.createElement('custom-alert');
        alert.setMessage("something went wrong...");
        alert.modalInstance.show();
        return this.reRender();
    }

    this.friends.push(this.friend);
    this.friendRequests = this.friendRequests.filter(
        (request) => request.info.id !== this.profile.id
    );
    this.updateFriendBtnStatus('friend');
}


/* === Friend EventHandler : ================================================ */
function FriendEventHandler(friend, isAccepted) {

    this.friendRequests = this.friendRequests.filter(
        (request) => request.info.id !== friend.id
    );

    if (isAccepted) this.friends.push(friend);
    return this.updateFrindNav();
}
