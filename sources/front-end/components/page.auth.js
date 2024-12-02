
import { Component }  from "../core/component.js";
import { utils as _ } from "../tools/utils.js";

/* *************************************************************************** #
#   * AuthApp page Class :                                                     #
# *************************************************************************** */
export class AuthPage extends Component
{
    /* === template : ======================================================= */
    get template() {
        return /* html */ `
        <section class="container-auth">
            <img src="/static/assets/imgs/logo.svg" alt="Logo">
            <hr />
            <div class="container-content">
                <slot></slot>
            </div>
        </section>
        `;
    }

    /* === styles : ========================================================= */
    get styles() {
        return /* css */ `
            :host {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                box-sizing: border-box;
                overflow: hidden;
            }

            img {
                pointer-events: none;
            }

            .container-auth {
                width: 600px;
                height: 700px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: linear-gradient(to right, rgba(56, 56, 56, 0.5) 3%, rgba(44, 44, 44, 0.5) 100%);
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                padding: 49px 99px;
            }

            .container-auth img {
                width: 12rem;
                max-width: 70%;
                padding: 20px 0;
                margin-top: 41px;
            }

            .container-auth hr {
                width: 100%;
                border: none;
                height: 1px;
                background-color: rgba(255, 255, 255, 0.2);
                margin: 20px 0;
            }

            .container-content {
                width: 100%;
                height: 100%;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-bottom: 70px;
            }

            @media screen and (max-width: 768px){
                .container-auth {
                    width: 100%;
                    height: 100vh;
                    border-radius: 0;
                    padding: 0 40px !important;
                    justify-content: center;
                }

                .container-content {
                    flex: 0;
                }

                .container-auth hr {
                    margin-bottom: 40px;
                }

                .container-auth img {
                    width: 11rem;
                    margin: 0;
                }
            }

            @media screen and (max-width: 480px) {
                .container-auth {
                    padding: 30px !important;
                }

                .container-auth img {
                    width: 10rem;
                }
            }

            @media screen and (max-width: 360px) {
                .container-auth {
                    padding: 20px !important;
                }

                .container-auth img {
                    width: 8rem;
                }

                .container-auth hr {
                    margin-bottom: 20px;
                }
            }
        `;
    };
}
