import { css, html, LitElement } from 'lit-element';
import { authClientUser, handleAuthenticatedUser, getUserInfo, checLogin, getLoggedInUser } from '../services/Twitch';

export default class TwitchAuthComp extends LitElement {

    static get styles() {
        return css`
            :host {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 45px;
            }
            
            .user-icon {
                width: 24px;
                height: 24px;
                position: relative;
                cursor: pointer;
            }
            .user-icon img {
                overflow: hidden;
                border-radius: 50%;
                background: #333333;
            }
            .user-icon img[loading] {
                opacity: 0;
            }
            .user-icon:hover::after {
                content: "Switch User";
                position: absolute;
                left: calc(100% + 5px);
                top: 50%;
                transform: translate(0, -50%);
                padding: 4px 8px;
                border-radius: 3px;
                z-index: 10000;
                background: rgb(0 0 0 / 50%);
                backdrop-filter: blur(4px);
                width: max-content;
            }
        `;
    }

    constructor() {
        super();

        this.user = null;

        if(checLogin()) {
            getLoggedInUser().then(info => {
                this.user = info.preferred_username;
                this.update();
            })
        }
    }

    pasteToken(e) {
        navigator.clipboard.readText().then(clipText => {
            handleAuthenticatedUser(clipText);
        });
    }

    render() {
        if(!this.user) {
            return html`
                <div class="auth">
                    <button @click="${e => authClientUser()}">Login</button>
                    <button @click="${e => this.pasteToken(e)}">Paste Token</button>
                </div>
            `;
        } else {

            const img = new Image();
            img.width = 24;
            img.alt = this.user;
            img.setAttribute('loading', '');

            getUserInfo(this.user).then(info => {
                img.src = info.profile_image_url;
                img.removeAttribute('loading');
            })

            return html`
                <div class="auth">
                    <div class="user-icon">
                        ${img}
                    </div>
                </div>
            `;
        }
    }
}

customElements.define('twitch-auth', TwitchAuthComp);