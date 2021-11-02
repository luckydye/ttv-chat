import EmoteService from './EmoteService';
import { Emote, EmoteMap } from './Emote';

let globalEmotes: EmoteMap = {};

class SevenTVEmote extends Emote {
    static get url_template() {
        return "https://cdn.7tv.app/emote/{{id}}/{{scale}}";
    }
    static get scale_temlate() {
        return {
            x1: "1x",
            x2: "2x",
            x3: "3x",
        }
    }
}

export default class SevenTVEmotes extends EmoteService {

    static get service_name(): string {
        return "7tv";
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static async getGlobalEmotes(): Promise<EmoteMap | undefined> {
        return fetch("https://api.7tv.app/v2/emotes/global")
            .then(res => res.json())
            .then(data => {
                for (let emote of data) {
                    globalEmotes[emote.name] = new SevenTVEmote(emote);
                }
                return globalEmotes;
            });
    }

    static async getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
        return fetch(`https://api.7tv.app/v2/users/${id}/emotes`)
            .then(res => res.json())
            .then(data => {
                const channelEmotes: EmoteMap = {};
                if(data.status !== 404) {
                    for (let emote of data) {
                        channelEmotes[emote.name] = new SevenTVEmote(emote);
                    }
                }
                return channelEmotes;
            });
    }

}
