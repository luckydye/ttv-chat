import { css, html, LitElement } from 'lit-element';
import TwitchAPI, { getUserInfo, checLogin, getLoggedInUser } from '../services/Twitch';
import ContextMenu from './ContextMenu';

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

    user: { [key: string]: string } | null = null;

    constructor() {
        super();

        if(checLogin()) {
            getLoggedInUser().then(info => {
                this.user = info;
                this.update();
            })
        }
    }

    logout() {
        TwitchAPI.logout();
    }

    render() {
        if(this.user) {
            const img = new Image();
            img.width = 24;
            img.alt = this.user.preferred_username;
            img.setAttribute('loading', '');

            getUserInfo(this.user.preferred_username).then(info => {
                img.src = info.profile_image_url;
                img.removeAttribute('loading');
            })

            return html`
                <div class="auth">
                    <div class="user-icon" @click="${e => {
                        const menu = ContextMenu.openOn(e.target);
                        const btn = document.createElement('button');
                        btn.innerHTML = "Logout";
                        btn.onclick = () => {
                            this.logout();
                        }
                        menu.append(btn);
                    }}">
                        ${img}
                    </div>
                </div>
            `;
        }
    }
}

customElements.define('twitch-profile', TwitchAuthComp);