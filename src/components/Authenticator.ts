import { css, html, LitElement } from 'lit-element';
import { authClientUser, handleAuthenticatedUser, getUserInfo, checLogin, getLoggedInUser } from '../services/Twitch';

export default class TwitchAuthComp extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
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
            return html`
                <div class="auth">
                    <div>${this.user}</div>
                </div>
            `;
        }
    }
}

customElements.define('twitch-auth', TwitchAuthComp);