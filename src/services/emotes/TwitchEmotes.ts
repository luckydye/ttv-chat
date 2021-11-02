import EmoteService from './EmoteService';
import { fetchTwitchApi } from '../Twitch';
import { Emote, EmoteMap } from './Emote';

let globalEmotes: EmoteMap = {};

class TwitchEmote extends Emote {
    static get url_template() {
        const theme = "dark";
        const format = "default";
        return `https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/${format}/${theme}/{{scale}}`;
    }
    static get scale_temlate() {
        return {
            x1: "1.0",
            x2: "2.0",
            x3: "3.0",
        }
    }
}

export default class TwitchEmotes extends EmoteService {

    static get service_name(): string {
        return "twitch";
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static async getGlobalEmotes(): Promise<EmoteMap | undefined> {
        return fetchTwitchApi("/chat/emotes/global").then(data => {
            for(let emote of data.data) {
                globalEmotes[emote.name] = new TwitchEmote(emote);
            }
            return globalEmotes;
        });
    }

    static async getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
        return fetchTwitchApi("/chat/emotes", "broadcaster_id=" + id).then(data => {
            if(data.status == 200) {
                const channelEmotes: EmoteMap = {};
                for(let emote of data.data) {
                    channelEmotes[emote.name] = new TwitchEmote(emote);
                }
                return channelEmotes;
            }
        });
    }

}
