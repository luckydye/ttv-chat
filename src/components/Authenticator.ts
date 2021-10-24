import { css, html, LitElement } from 'lit-element';
import { authClientUser, handleAuthenticatedUser } from '../services/Twitch';

export default class TwitchAuthComp extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    pasteToken(e) {
        navigator.clipboard.readText().then(clipText => {
            handleAuthenticatedUser(clipText);
        });
    }

    render() {
        return html`
            <div class="auth">
                <button @click="${e => authClientUser()}">Login</button>
                <button @click="${e => this.pasteToken(e)}">Paste Token</button>
            </div>
        `;
    }
}

customElements.define('twitch-auth', TwitchAuthComp);