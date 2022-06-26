export interface EmoteMap {
	[key: string]: Emote;
}

export class Emote {
	static get url_template() {
		return "";
	}

	static get scale_template() {
		return {
			x1: "x1",
			x2: "x2",
			x3: "x3",
		};
	}

	get url_x1() {
		return this.constructor.url_template
			.replace("{{id}}", this.id)
			.replace("{{scale}}", this.constructor.scale_template.x1);
	}

	get url_x2() {
		return this.constructor.url_template
			.replace("{{id}}", this.id)
			.replace("{{scale}}", this.constructor.scale_template.x2);
	}

	get url_x3() {
		return this.constructor.url_template
			.replace("{{id}}", this.id)
			.replace("{{scale}}", this.constructor.scale_template.x3);
	}

	id: string;

	constructor(emote: { id: string }) {
		this.id = emote.id;
	}
}
