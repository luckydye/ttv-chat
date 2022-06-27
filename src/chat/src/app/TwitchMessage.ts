type EmoteRange = [number, number];

export interface Emote {
	id: string;
	ranges: EmoteRange[];
}

export interface Badge {
	id: string;
	version: number;
}

export class TwitchMessage {
	public id: string;

	public type: "user" | "system";

	public timestamp: number;

	public userId: string;

	public firstMesssage: boolean;

	public hasMod: boolean;

	public hasSubscription: boolean;

	public retunrning: boolean;

	public roomId: string;

	public color: string;

	public name: string;

	public badgeInfo: string;

	public message?: string;

	public channel?: string;

	public tags: Record<string, string>;

	public emotes: Emote[];

	public badges: Badge[];

	constructor(message: IRCMessage) {
		this.id = message.tags["id"];
		this.timestamp = +message.tags["tmi-sent-ts"] || new Date().valueOf();
		this.userId = message.tags["user-id"];
		this.firstMesssage = message.tags["first-msg"] === "1";
		this.hasMod = message.tags["mod"] === "1";
		this.hasSubscription = message.tags["subscriber"] === "1";
		this.retunrning = message.tags["returning-chatter"] === "1";
		this.roomId = message.tags["room-id"];
		this.color = message.tags["color"];
		this.name = message.tags["display-name"];
		this.badgeInfo = message.tags["badge-info"];

		if (this.id) {
			this.type = "user";
		} else {
			this.type = "system";
		}

		this.tags = message.tags;

		this.message = message.message;
		this.channel = message.channel;

		this.emotes = message.tags["emotes"]?.split("/").map((idRange) => {
			const id = idRange.split(":")[0];
			const ranges: EmoteRange[] = idRange
				.split(":")[1]
				.split(",")
				.map((range) => {
					const r = range.split("-");
					return [+r[0], +r[1]];
				});

			const emote: Emote = {
				id: id,
				ranges: ranges,
			};
			return emote;
		});

		console.log(message.tags["emotes"]);

		this.badges = message.tags["badges"]?.split(",").map((idSlot) => {
			const badge: Badge = {
				id: idSlot.split("/")[0],
				version: +idSlot.split("/")[1],
			};
			return badge;
		});
	}
}
