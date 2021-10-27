import EmoteService from './EmoteService';

let globalEmotes = {};
let emoteTemplate = "https://cdn.7tv.app/emote/{{id}}/{{scale}}";

export default class SevenTVEmotes extends EmoteService {

    static get template() {
        return emoteTemplate;
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static getGlobalEmotes() {
        return fetch("https://api.7tv.app/v2/emotes/global")
            .then(res => res.json())
            .then(data => {
                for (let emote of data) {
                    globalEmotes[emote.name] = this.parseEmoteUrl(emote);
                }
                return globalEmotes;
            });
    }

    static getChannelEmotes(id: string) {
        return fetch(`https://api.7tv.app/v2/users/${id}/emotes`)
            .then(res => res.json())
            .then(data => {
                const channelEmotes = {};
                if(data.status !== 404) {
                    for (let emote of data) {
                        channelEmotes[emote.name] = this.parseEmoteUrl(emote);
                    }
                }
                return channelEmotes;
            });
    }

    static parseEmoteUrl(emote) {
        return emoteTemplate.substring(0)
            .replace("{{id}}", emote.id)
            .replace("{{scale}}", "2x");
    }

}

SevenTVEmotes.getGlobalEmotes();
