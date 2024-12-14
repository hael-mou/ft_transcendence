const style = `<style>
* {
    padding: 0;
    margin: 0;
}

.overlay {
    height: 96%;
    width: 97%;
    position: absolute;
    top: 2%;
    left: 1.5%;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(3.6px);
    -webkit-backdrop-filter: blur(3.6px);
    border: 1px solid rgba(255, 255, 255, 0.01);
    transition: 0.4s ease-out;
}

.overlay.hidden {
    opacity: 0;
    animation: none;
    visibility: hidden;
    display: none;
}

.loader {
      width: 28px;
      height: 28px;
      border:10px solid #FFF;
      border-radius: 50%;
      position: relative;
      transform:rotate(45deg);
      box-sizing: border-box;
    }
    .loader::before {
      content: "";
      position: absolute;
      box-sizing: border-box;
      inset:-10px;
      border-radius: 50%;
      border:10px solid #1E90FF;
      animation: prixClipFix 2s infinite linear;
    }

    @keyframes prixClipFix {
        0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
        25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
        50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
        75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
        100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
    }


</style>`;

const template = `
${style}
<div class="overlay">
    <span class="loader"></span>
</div>`;



class loadingOverlay extends HTMLElement {
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

    hideElement() {
        this.shadowRoot.querySelector('.overlay').classList.add('hidden');
    }
};

customElements.define("loadingoverlay-component", loadingOverlay);

export default loadingOverlay;
