import EmoteService from "./EmoteService";
import TwitchApi from "../twitch/Api";
import { Emote, EmoteMap } from "./Emote";

let globalEmotes: EmoteMap = {};
let emoteSets: Map<number, EmoteSet> = new Map();

export class TwitchEmote extends Emote {
	static get url_template() {
		const theme = "dark";
		const format = "default";
		return `https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/${format}/${theme}/{{scale}}`;
	}
	static get scale_template() {
		return {
			x1: "1.0",
			x2: "2.0",
			x3: "3.0",
		};
	}

	type: string;
	owner_id: string;

	constructor(emote: { id: string; emote_type: string; owner_id: string }) {
		super(emote);

		this.owner_id = emote.owner_id;
		this.type = emote.emote_type;
	}
}

export interface EmoteSet {
	name: string;
	emotes: EmoteMap;
}

export default class TwitchEmotes extends EmoteService {
	static get service_name(): string {
		return "twitch";
	}

	static get global_emotes() {
		return globalEmotes;
	}

	static async getGlobalEmotes(): Promise<EmoteMap | undefined> {
		return TwitchApi.fetch("/chat/emotes/global").then((data) => {
			for (let emote of data.data) {
				globalEmotes[emote.name] = new TwitchEmote(emote);
			}
			return globalEmotes;
		});
	}

	static async getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
		return TwitchApi.fetch("/chat/emotes", "broadcaster_id=" + id).then(
			(data) => {
				if (data.data) {
					const channelEmotes: EmoteMap = {};
					for (let emote of data.data) {
						channelEmotes[emote.name] = new TwitchEmote(emote);
					}
					return channelEmotes;
				}
			}
		);
	}

	static async getEmoteSets(
		emote_sets: Array<number>
	): Promise<Array<EmoteSet>> {
		return Promise.all(
			emote_sets.map((set_id) => this.getEmoteSet(set_id))
		).then((sets) => {
			const fitlerdSets = [];
			for (let set of sets) {
				if (set != null) {
					fitlerdSets.push(set);
				}
			}
			return fitlerdSets;
		});
	}

	static async getEmoteSet(emote_set_id: number) {
		if (emoteSets.has(emote_set_id)) {
			return emoteSets.get(emote_set_id);
		}

		return TwitchApi.fetch(
			"/chat/emotes/set",
			"emote_set_id=" + emote_set_id
		).then(async (data) => {
			if (data.data && data.data.length > 0) {
				const emtoeSet: EmoteMap = {};
				for (let emote of data.data) {
					emtoeSet[emote.name] = new TwitchEmote(emote);
				}
				let set_name = data.data[0].emote_type;
				if (set_name == "subscriptions") {
					const channel = await TwitchApi.getChannel(data.data[0].owner_id);
					set_name = channel[0]?.broadcaster_name || set_name;
				}

				const set = {
					name: set_name,
					emotes: emtoeSet,
				};
				emoteSets.set(emote_set_id, set);
				return set;
			}
		});
	}
}
