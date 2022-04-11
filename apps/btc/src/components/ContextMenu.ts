import { css, html, LitElement } from 'lit';

export default class ContextMenu extends LitElement {
	static get styles() {
		return css`
			@keyframes slide-right {
				from {
					opacity: 0;
					transform: translate(-10px, 0);
				}
			}
			@keyframes slide-down {
				from {
					opacity: 0;
					transform: translate(0, -10px);
				}
			}
			@keyframes slide-up {
				from {
					opacity: 0;
					transform: translate(0, 10px);
				}
			}
			:host {
				outline: none;
				animation: var(--anim, slide-in) 0.15s ease;
				display: block;
				position: fixed;
				top: calc(var(--y, 0) * 1px);
				left: calc(var(--x, 0) * 1px);
				z-index: 10000000;
				padding: 5px;
				border-radius: 6px;
				box-shadow: rgb(0 0 0 / 25%) 1px 2px 8px;
				border: 1px solid rgb(48, 48, 48);
				background: rgba(31, 31, 35, 0.94);
				backdrop-filter: blur(12px);
			}
			/* // webkit scrollbars */
			::-webkit-scrollbar {
				width: 8px;
				margin: 5px 0;
			}
			::-webkit-scrollbar-button {
				display: none;
			}
			::-webkit-scrollbar-track-piece {
				background: transparent;
			}
			::-webkit-scrollbar-thumb {
				background: var(--color-scrollbar-thumb, #464646);
				border-radius: 5px;
			}
			::-webkit-scrollbar-thumb:hover {
				background: var(--color-scrollbar-thumb-hover, #555555);
			}
			::-webkit-scrollbar-corner {
				background: transparent;
			}
		`;
	}

	static openOn(ele: HTMLElement, direction: string) {
		const rect = ele.getClientRects()[0];

		let x = rect.x;
		let y = rect.y;

		switch (direction) {
			case 'down':
				x -= 10;
				y += 25;
				break;
			case 'right':
				x += 20;
				y += 25;
				break;
			case 'up':
				x -= rect.width + 300;
				y -= 400;
				break;
			default:
				x += 40;
				y -= 10;
				break;
		}

		const overlap = Math.min(window.innerWidth - (x + rect.width), 0);
		x += overlap - 10;

		const newEle = new this(x, y);

		switch (direction) {
			case 'down':
				newEle.style.setProperty('--anim', 'slide-down');
				break;
			case 'right':
				newEle.style.setProperty('--anim', 'slide-right');
				break;
			case 'up':
				newEle.style.setProperty('--anim', 'slide-up');
				break;
			default:
				newEle.style.setProperty('--anim', 'slide-right');
				break;
		}

		document.body.append(newEle);
		return newEle;
	}

	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		super();

		this.x = x;
		this.y = y;

		this.addEventListener('blur', (e) => {
			setTimeout(() => {
				// check if any inner element has the focus
				if (document.activeElement !== this) {
					this.close();
				}
			}, 150);
		});
	}

	close() {
		this.remove();
	}

	connectedCallback() {
		super.connectedCallback();

		this.style.setProperty('--x', this.x.toString());
		this.style.setProperty('--y', this.y.toString());
		this.tabIndex = 0;

		this.focus();
	}

	render() {
		return html`
			<div>
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('context-menu', ContextMenu);
