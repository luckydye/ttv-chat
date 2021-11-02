import { css, html, LitElement } from 'lit-element';
import { authClientUser, handleAuthenticatedUser, checLogin, getLoggedInUser } from '../services/Auth';
import './Loader';

export default class TwitchAuthComp extends LitElement {

    loggedin = false;
    loading = true;

    constructor() {
        super();

        if(checLogin()) {
            getLoggedInUser().then(info => {
                this.loading = false;
                this.loggedin = info.preferred_username ? true : false;
                this.update();
            })
        } else {
            this.loading = false;
        }
    }

    createRenderRoot() {
        return this;
    }

    pasteToken(e) {
        navigator.clipboard.readText().then(clipText => {
            const json = JSON.parse(clipText);
            handleAuthenticatedUser(json.access_token);
            
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    render() {
        if(this.loading) {
            return html`<net-loader></net-loader>`;
        } else if(!this.loggedin) {
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