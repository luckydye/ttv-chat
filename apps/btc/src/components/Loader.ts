import { css, html, LitElement } from 'lit';

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
			.loader img {
				width: 32px;
				height: 32px;
				animation: rotate 1s linear infinite;
			}
		`;
	}

	render() {
		return html`
			<div class="loader">
				<img src="./images/loader.svg" />
			</div>
		`;
	}
}

customElements.define('net-loader', Loader);
