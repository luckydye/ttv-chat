import { css, html, LitElement } from "lit";

export default class Loader extends LitElement {
	static get styles() {
		return css`
			:host {
				display: block;
				z-index: 10000000000;
			}
			.loader {
				display: flex;
				justify-content: center;
				align-items: center;
				width: auto;
			}
			@keyframes rotate {
				from {
					transform: rotate(0);
				}
				to {
					transform: rotate(-360deg);
				}
			}
			.loader svg-icon {
				--size: 32px;
				animation: rotate 1s linear infinite;
			}
		`;
	}

	render() {
		return html`
			<div class="loader">
				<svg-icon icon="loader"></svg-icon>
			</div>
		`;
	}
}

customElements.define("net-loader", Loader);
