import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

type IconMap = Record<string, string>;

@customElement("svg-icon")
export class SVGIcon extends LitElement {
	static icons: IconMap = {};

	static get styles() {
		return css`
			:host {
				display: contents;
				font-size: var(--size, 1rem);
			}

			svg {
				display: inline-block;
				vertical-align: middle;
				width: 1em;
				height: 1em;
			}
		`;
	}

	@property({ type: String, reflect: true })
	public icon?: string;

	render() {
		if (this.icon) {
			return html`${unsafeHTML(SVGIcon.icons[this.icon])}`;
		}
	}
}
