import { css, html, LitElement } from 'lit-element';
import { authClientUser, handleAuthenticatedUser, checLogin, getLoggedInUser } from '../services/Twitch';

export default class TwitchAuthComp extends LitElement {

    loggedin = false;

    constructor() {
        super();

        if(checLogin()) {
            getLoggedInUser().then(info => {
                this.loggedin = info.preferred_username ? true : false;
                this.update();
            })
        }
    }

    createRenderRoot() {
        return this;
    }

    pasteToken(e) {
        navigator.clipboard.readText().then(clipText => {
            handleAuthenticatedUser(clipText);
        });
    }

    render() {
        if(!this.loggedin) {
            return html`
                <h3>Do not show this on stream!</h3>
                <br/>
                <div class="auth">
                    <button @click="${e => authClientUser()}">Login</button>
                    <button @click="${e => this.pasteToken(e)}">Paste Token</button>
                </div>
            `;
        }
    }
}

customElements.define('twitch-login-panel', TwitchAuthComp);