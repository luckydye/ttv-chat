import EmoteService from './EmoteService';

let globalEmotes = {};
let emoteTemplate = "https://cdn.betterttv.net/emote/{{id}}/{{scale}}";

export default class BTTVEmotes extends EmoteService {

    static get template() {
        return emoteTemplate;
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static getGlobalEmotes() {
        return fetch("https://api.betterttv.net/3/cached/emotes/global")
            .then(res => res.json())
            .then(data => {
                for (let emote of data) {
                    globalEmotes[emote.code] = this.parseEmoteUrl(emote);
                }

                return globalEmotes;
            });
    }

    static getChannelEmotes(id: string) {
        return fetch("https://api.betterttv.net/3/cached/users/twitch/" + id)
            .then(res => res.json())
            .then(data => {
                const channelEmotes = {};
                console.log(data, data.sharedEmotes);
                
                if(data.channelEmotes) {
                    for (let emote of data.channelEmotes) {
                        channelEmotes[emote.code] = this.parseEmoteUrl(emote);
                    }
                }
                if(data.sharedEmotes) {
                    for (let emote of data.sharedEmotes) {
                        channelEmotes[emote.code] = this.parseEmoteUrl(emote);
                    }
                }
                return channelEmotes;
            });
    }

    static parseEmoteUrl(emote) {
        // https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_a89c40939a4c4ce49ea2cbee83db26ca/static/light/2.0
        // https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}
        return emoteTemplate.substring(0)
            .replace("{{id}}", emote.id)
            .replace("{{scale}}", "2x");
    }

}

BTTVEmotes.getGlobalEmotes();
