import EmoteService from './EmoteService';
import { fetchTwitchApi } from '../Twitch';

let globalEmotes = {};
let emoteTemplate = "";

export default class TwitchEmotes extends EmoteService {

    static get template() {
        return emoteTemplate;
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static getGlobalEmotes() {
        return fetchTwitchApi("/chat/emotes/global").then(data => {
            emoteTemplate = data.template;
            for(let emote of data.data) {
                globalEmotes[emote.name] = this.parseEmoteUrl(emote);
            }
            return globalEmotes;
        });
    }

    static getChannelEmotes(id: string) {
        return fetchTwitchApi("/chat/emotes", "broadcaster_id=" + id).then(data => {
            if(data.status == 200) {
                const channelEmotes = {};
                for(let emote of data.data) {
                    channelEmotes[emote.name] = this.parseEmoteUrl(emote);
                }
                return channelEmotes;
            }
        });
    }
    
    static parseEmoteUrl(emote) {
        // https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_a89c40939a4c4ce49ea2cbee83db26ca/static/light/2.0
        // https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}
        return TwitchEmotes.template.substring(0)
            .replace("{{id}}", emote.id)
            .replace("{{format}}", "default")
            .replace("{{theme_mode}}", "dark")
            .replace("{{scale}}", "2.0");
    }

}

TwitchEmotes.getGlobalEmotes();