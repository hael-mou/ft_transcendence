
import { profileGateway }  from "../../core/config.js";
import { Component } from "../../core/component.js";
import { utils as _ } from "../../tools/utils.js";
import { Http } from  "../../tools/http.js";
import { Auth } from "../../tools/http.js";

/* *************************************************************************** #
#   * Profile Component Class :                                                #
# *************************************************************************** */
export class ProfileApp extends Component {

    /* === variables : ====================================================== */
    myProfile = undefined;
    myFriends = undefined;


    /* === init : =========================================================== */
    async init() {

        const myId        = await Auth.getUserId();
        this.userId       = _.getQueryParams().id || myId;
        this.isMyProfile  = this.userId == myId;

        await this.initMyProfile();

        const profileUrl = `${profileGateway.getProfileUrl}?id=${this.userId}`;
        this.profile = (await Http.getwithAuth(profileUrl))?.json[0] || ProfileApp.myProfile;






        ProfileApp.myProfile = ProfileApp.myProfile ?? (await Http.getwithAuth(myProfileUrl)).json;

        console.log(ProfileApp.myProfile);
        if (!this.profile) {
            profileUrl = profileGateway.myProfileUrl;
            history.replaceState(null, null, "/profile");
            this.profile = (await Http.getwithAuth(profileUrl)).json
        }
    }

    /* === initMyProfile : ================================================== */
    async initMyProfile() {

        const myProfileUrl  =  profileGateway.myProfileUrl;
        const myFriendsUrl  = profileGateway.getFriendsUrl;

        if (!ProfileApp.myProfile)
            ProfileApp.myProfile = (await Http.getwithAuth(myProfileUrl)).json;

        if (!ProfileApp.myFriends)
            ProfileApp.myFriends = (await Http.get(myFriendsUrl)).json["friends"] || [];

    }

    /* === render : ========================================================= */
    render() {
        super.render();
        this.updatePage();
    }

    /* === reRender : ======================================================= */
    async reRender() {
        await this.init();
        this.updatePage();
    }

    /* === updatePage : ===================================================== */
    updatePage() {
        const frendNav = this.shadowRoot.getElementById('frend-nav');
        const eventBottons = this.shadowRoot.getElementById('event-buttons');
        const content = this.shadowRoot.getElementById('contentt');
        content.classList.add('mw-70');

        this.updateProfile();
        this.updateProfileButtons();

        if (!this.isMyProfile) {
            eventBottons.classList.remove('d-none');
            frendNav.classList.add('d-none');
            content.classList.remove('mw-70');
            return ;
        }

        eventBottons.classList.add('d-none');
        frendNav.classList.remove('d-none');
    }

    /* === Profile Update : ================================================= */
    updateProfile() {
        const avatar   = this.shadowRoot.getElementById('avatar');
        const userInfo = this.shadowRoot.getElementById('user-info');
        const username = this.shadowRoot.getElementById('username');

        avatar.src = this.profile?.avatar || '/static/assets/imgs/user_avatar.png';
        userInfo.textContent = this.profile?.first_name || 'Anonymous';
        userInfo.textContent += " " +this.profile?.last_name || '';
        username.textContent = "@" +this.profile?.username || 'anonymous';
    }

    /* === updateProfileButtons : =========================================== */
    updateProfileButtons() {

        const eventBottons = this.shadowRoot.getElementById('event-buttons');

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
                    <button class="btn btn-primary mx-2">Follow</button>
                    <button class="btn btn-secondary mx-2">Message</button>
                </div>

                <!-- profile Body Section-->
                <div class="profile-body d-flex flex-nowrap">

                    <!-- Content Section (Left) -->
                    <div id="contentt" class="content p-3">

                        <div id="statistics" class="w-100">
                            <h4 class="title mt-0">History Matches</h4>
                            <div class="stat-item">
                                <span>Games Played</span>
                                <span id="game-played">100</span>
                            </div>

                            <div class="stat-item">
                                <span>Win Rate</span>
                                <span id="win-rate">65%</span>
                            </div>

                            <div class="stat-item">
                                <span>Lose Rate</span>
                                <span id="lose-rate">35%</span>
                            </div>

                            <div class="stat-item">
                                <span>Highest Score</span>
                                <span id="highest-score">2300</span>
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

            @media (max-width: 1180px) {
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

}
