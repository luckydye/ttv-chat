import { css, html, LitElement } from "lit";
import { logout } from "../services/Auth";
import Account from "../app/Account";
import ContextMenu from "./ContextMenu";

export default class TwitchAuthComp extends LitElement {
	static get styles() {
		return css`
			:host {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
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

	user: Account | null = null;

	constructor() {
		super();

		window.addEventListener("app-login", (e) => {
			this.user = e.data.account;
			this.requestUpdate();
		});
	}

	logout() {
		logout();
	}

	render() {
		if (this.user) {
			const img = new Image();
			img.width = 24;
			img.alt = this.user.user_login;
			img.src = this.user.profile_image;

			return html`
				<div class="auth">
					<div
						class="user-icon"
						@click="${(e) => {
							const menu = ContextMenu.openOn(e.target);
							const btn = document.createElement("button");
							btn.innerHTML = "Logout";
							btn.onclick = () => {
								this.logout();
							};
							menu.append(btn);
						}}"
					>
						${img}
					</div>
				</div>
			`;
		}
	}
}

customElements.define("twitch-profile", TwitchAuthComp);
