import EmoteService from './EmoteService';

let globalEmotes = {};
let emoteTemplate = "https://cdn.frankerfacez.com/emote/{{id}}/{{scale}}";

export default class FFZEmotes extends EmoteService {

    static get template() {
        return emoteTemplate;
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static getGlobalEmotes() {
        return {};
    }

    static getChannelEmotes(id: string) {
        return fetch("https://api.frankerfacez.com/v1/room/id/" + id)
            .then(res => res.json())
            .then(data => {
                if(data.sets) {
                    const channelEmotes = {};
                    for(let set in data.sets) {
                        for (let emote of data.sets[set].emoticons) {
                            channelEmotes[emote.name] = this.parseEmoteUrl(emote);
                        }
                    }
                    return channelEmotes;
                }
            });
    }

    static parseEmoteUrl(emote) {
        // https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_a89c40939a4c4ce49ea2cbee83db26ca/static/light/2.0
        // https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}
        return emoteTemplate.substring(0)
            .replace("{{id}}", emote.id)
            .replace("{{scale}}", "2");
    }

}

FFZEmotes.getGlobalEmotes();
