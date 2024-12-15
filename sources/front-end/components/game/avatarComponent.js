const style = `<style>
    .avatar {
        height: 6rem;
        width: 6rem;
        box-shadow: 0 0 16px 0px #fff;
        border-radius: 100%;
    }
    .winner {
        box-shadow: rgba(55, 190, 172, 0.4) 0px 5px, rgba(55, 190, 172, 0.3) 0px 10px, rgba(55, 190, 172, 0.2) 0px 15px, rgba(55, 190, 172, 0.1) 0px 20px, rgba(55, 190, 172, 0.05) 0px 25px;
    }
    .loser {
        box-shadow: rgba(244, 86, 128, 0.4) 0px 5px, rgba(244, 86, 128, 0.3) 0px 10px, rgba(244, 86, 128, 0.2) 0px 15px, rgba(244, 86, 128, 0.1) 0px 20px, rgba(244, 86, 128, 0.05) 0px 25px;
    }

    @media only screen and (max-width: 1000px) {
        .avatar {
            height: 4.5rem;
            width: 4.5rem;
        }
    }

    @media only screen and (max-width: 600px) {
        .avatar {
            height: 3.5rem;
            width: 3.5rem;
        }
    }

    @media only screen and (max-width: 400px) {
        .avatar {
            height: 2.5rem;
            width: 2.5rem;
        }
    }

    @media only screen and (max-width: 300px) {
        .avatar {
            height: 2rem;
            width: 2rem;
        }
    }

</style>`;

const template = `
    ${style}
    <img class="avatar" src="/static/assets/imgs/loading.gif" alt="none">
`;



class avatarComponent extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});
    }

    render () {
        this.shadowRoot.innerHTML = template;
    }

    connectedCallback () {
        this.render();
    }

    getAvatarSrc() {
        return (this.shadowRoot.querySelector('.avatar').src);
    }

    async setAvatar (src) {
        const defaultAvatarSrc = localStorage.getItem('avatar') || "/static/assets/imgs/user_avatar.png";
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            this.shadowRoot.querySelector('.avatar').src = objectUrl;
        } catch (e) {
            console.error("Enable to fetch user image");
            this.shadowRoot.querySelector('.avatar').src = defaultAvatarSrc;
        }
    }

    setWinner() {
        this.shadowRoot.querySelector('.avatar').classList.add('winner');
    }

    setLoser() {
        this.shadowRoot.querySelector('.avatar').classList.add('loser');
    }

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            const interval = setInterval(() => {
                const element = this.shadowRoot.querySelector('.avatar');
                if (element) {
                    element.src = newValue;
                    clearInterval(interval);
                }
            }, 1);
        }
    }
};

customElements.define("avatar-component", avatarComponent);

export default avatarComponent;
