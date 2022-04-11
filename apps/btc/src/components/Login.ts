import { css, html, LitElement } from 'lit';
import { authClientUser, handleAuthenticatedUser, checLogin, getLoggedInUser } from '../services/Auth';
import './Loader';

export default class TwitchAuthComp extends LitElement {
	loggedin = false;
	loading = true;

	constructor() {
		super();

		const logged_in = checLogin();

		if (logged_in instanceof Promise) {
			logged_in.then((logged_in) => {
				this.loading = false;
				this.loggedin = logged_in;
				this.requestUpdate();
			});
		} else {
			this.loading = false;
		}
	}

	createRenderRoot() {
		return this;
	}

	pasteToken(e) {
		navigator.clipboard.readText().then((clipText) => {
			const json = JSON.parse(clipText);
			handleAuthenticatedUser(json.access_token).then((logged_in) => {
				if (logged_in) {
					this.loggedin = logged_in;
					this.requestUpdate();
				} else {
					alert('Error logging in.');
				}
			});
		});
	}

	render() {
		if (this.loading) {
			return html`<net-loader></net-loader>`;
		} else if (!this.loggedin) {
			return html`
				<h3>Do not show this on stream!</h3>
				<br />
				<div class="auth">
					<button @click="${(e) => authClientUser()}">Login</button>
					<button @click="${(e) => this.pasteToken(e)}">Paste Token</button>
				</div>
			`;
		}
	}
}

customElements.define('twitch-login-panel', TwitchAuthComp);
