import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("async-img")
export default class AsyncImage extends LitElement {
	static get styles() {
		return css`
			:host {
				display: contents;
			}

			img {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition: opacity 0.5s ease;
				opacity: 1;
			}

			img.hidden {
				opacity: 0;
			}
		`;
	}

	@property({ type: String })
	public src?: string;

	@property({ type: String })
	public alt?: string;

	@property({ type: String })
	public width?: string;

	@property({ type: String })
	public height?: string;

	private _image = new Image();

	constructor() {
		super();

		this._image.addEventListener("load", () => {
			setTimeout(() => {
				this._image.classList.remove("hidden");
			}, 10);
		});
	}

	connectedCallback() {
		super.connectedCallback();
	}

	attributeChangedCallback(name, _old, value) {
		super.attributeChangedCallback(name, _old, value);

		if (name === "src") {
			this._image.src = value;
			this._image.width = +(this.width || 0);
			this._image.height = +(this.height || 0);
			this._image.loading = "lazy";
			this._image.alt = this.alt || "";
			this._image.classList.add("hidden");
		}
	}

	render() {
		return html`${this._image}`;
	}
}
