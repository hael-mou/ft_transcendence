
/* *************************************************************************** #
#   * Component Class :                                                        #
# *************************************************************************** */
export class Component extends HTMLElement
{
    /* === constructor : ==================================================== */
    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.listeners = [];
    }


    /* === connectedCallback : ============================================== */
    async connectedCallback()
    {
        if (this.init) await this.init();
        this.render();
        if (this.onConnected) this.onConnected();
    }


    /* === disconnectedCallback : =========================================== */
    disconnectedCallback()
    {
        this.listeners.forEach(
            listener => this.removeEventListener(listener)
        );

        this.listeners = [];
        if (this.onDisconnected) this.onDisconnected();
    }


    /* === render : ========================================================= */
    render()
    {
        this.shadowRoot.innerHTML = `
            <style>${this.styles}</style>
            ${this.template}
        `.trim();
    }


    /* === addEventListener : =============================================== */
    addEventListener(target, eventType, callback)
    {
        target.addEventListener(eventType, callback);
        const listener = { target, eventType, callback };
        this.listeners.push(listener);
        return listener;
    }


    /* === removeEventListener : ============================================ */
    removeEventListener({ target, eventType, callback })
    {
        target.removeEventListener(eventType, callback);

        this.listeners = this.listeners.filter(
            listener =>
                !(listener.target === target &&
                  listener.eventType === eventType &&
                  listener.callback === callback)
        );
    }
}
