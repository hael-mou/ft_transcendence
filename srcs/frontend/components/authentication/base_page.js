
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
        <section class="container-auth">
            <img src="/static/assets/imgs/logo.svg" alt="Logo">
            <hr />
            <slot></slot>
        </section>
        `;
    }

    /* === styles : ========================================================= */
    get styles() {
        return /* css */ `
          :host {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
            overflow: hidden;
          }

          .container-auth {
            width: 100%;
            max-width: 550px;
            min-height: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to right, rgba(56, 56, 56, 0.5) 3%, rgba(44, 44, 44, 0.5) 100%);
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(1px);
            transition: all 0.3s ease;
            padding: 50px 139px;
          }

          .container-auth img {
            width: 15rem;
            max-width: 70%;
            padding: 20px 0;
          }

          .container-auth hr {
            width: 100%;
            border: none;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.2);
            margin: 20px 0;
          }

          @media screen and (max-width: 768px) {
            .container-auth {
              max-width: 100%;
              min-height: 100vh;
              border-radius: 0;
              padding: 0 40px;
              box-sizing: border-box;
            }

            .container-auth img {
              width: 12rem;
            }
          }

          @media screen and (max-width: 480px) {
            .container-auth {
              padding: 30px;
            }

            .container-auth img {
              width: 10rem;
            }

            .container-auth hr {
              margin: 15px 0;
            }
          }

          @media screen and (max-width: 360px) {
            .container-auth {
              padding: 20px;
            }

            .container-auth img {
              width: 8rem;
            }

            .container-auth hr {
              margin: 10px 0;
            }
          }
        `;
      }
}
