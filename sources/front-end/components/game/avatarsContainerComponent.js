import avatarComponent from "./avatarComponent.js";

const style = `<style>
    #avatarsContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        // height: 80%;
        // width: 20%;
    }
    #avatarsContainer > * {
        margin: 1rem;
    }

</style>`;

const template = `
${style}
<div id="avatarsContainer">
<div id="leftAvatarContainer">
    <avatar-component></avatar-component>
</div>
<h3>VS</h3>
<div id="rightAvatarContainer">
    <avatar-component></avatar-component>
</div>
</div>`;

class avatarsComponent extends HTMLElement {
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

    getAvatarWithPosition(position) {
        let avatar;
        if (position === "left") {
            avatar = this.shadowRoot.querySelector('#leftAvatarContainer').querySelector('avatar-component');
        } else {
            avatar = this.shadowRoot.querySelector('#rightAvatarContainer').querySelector('avatar-component');
        }
        return (avatar);
    }

    setAvatarWithPosition(src, position) {
        const avatar = this.getAvatarWithPosition((position));
        avatar.setAvatar(src);
    }

    setWinner(position) {
        const avatar = this.getAvatarWithPosition((position));
        avatar.setWinner();
    }

    setLoser(position) {
        const avatar = this.getAvatarWithPosition((position));
        avatar.setLoser();
    }

    switchPositions(clientPosition) {
        if (clientPosition !== "left") {
            const clientAvatarUrl = this.getAvatarWithPosition("left").getAvatarSrc();
            const adversaryAvatarUrl = this.getAvatarWithPosition("right").getAvatarSrc();

            this.setAvatarWithPosition(clientAvatarUrl, "right");
            this.setAvatarWithPosition(adversaryAvatarUrl, "left");
        }
    }
};

customElements.define("avatars-component", avatarsComponent);

export default avatarsComponent;
