
import { Component } from "../../core/component.js";

/* *************************************************************************** #
#   * AuthApp page Class :                                                     #
# *************************************************************************** */
export class AuthApp extends Component
{
    /* === template : ======================================================= */
    get template()
    {
        return /* html */ `
            <main class="container-main">
                <slot></slot>
            </main>
        `;
    }


    /* === styles : ========================================================= */
    get styles()
    {
        return /*css*/`
            :host {
                width: 100%;
                height: 100%;
            }
        `;
  }


}
