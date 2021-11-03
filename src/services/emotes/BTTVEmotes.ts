import EmoteService from './EmoteService';
import { Emote, EmoteMap } from './Emote';

let globalEmotes: EmoteMap = {};

export class BTTVEmote extends Emote {
    static get url_template() {
        return "https://cdn.betterttv.net/emote/{{id}}/{{scale}}";
    }
    static get scale_template() {
        return {
            x1: "1x",
            x2: "2x",
            x3: "3x",
        }
    }
}

export default class BTTVEmotes extends EmoteService {

    static get service_name(): string {
        return "bttv";
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static async getGlobalEmotes(): Promise<EmoteMap | undefined> {
        return fetch("https://api.betterttv.net/3/cached/emotes/global")
            .then(res => res.json())
            .then(data => {
                for (let emote of data) {
                    globalEmotes[emote.code] = new BTTVEmote(emote);
                }

                return globalEmotes;
            });
    }

    static async getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
        return fetch("https://api.betterttv.net/3/cached/users/twitch/" + id)
            .then(res => res.json())
            .then(data => {
                const channelEmotes: EmoteMap = {};
                if(data.channelEmotes) {
                    for (let emote of data.channelEmotes) {
                        channelEmotes[emote.code] = new BTTVEmote(emote);
                    }
                }
                if(data.sharedEmotes) {
                    for (let emote of data.sharedEmotes) {
                        channelEmotes[emote.code] = new BTTVEmote(emote);
                    }
                }
                return channelEmotes;
            });
    }

}
