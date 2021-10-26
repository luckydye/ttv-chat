import { fetchTwitchApi } from './Twitch';

let globalEmotes = {};

export default class Emotes {

    static get global_emotes() {
        return globalEmotes;
    }

    static getGlobalEmotes() {
        return fetchTwitchApi("/chat/emotes/global").then(data => {
            const template = data.template;
            for(let emote of data.data) {
                globalEmotes[emote.name] = emote.images.url_2x;
            }
            console.log(globalEmotes);
        });
    }

    static getChannelEmotes(id: string) {
        return fetchTwitchApi("/chat/emotes", "broadcaster_id=" + id).then(data => {
            const template = data.template;
            const channelEmotes = {};
            for(let emote of data.data) {
                channelEmotes[emote.name] = emote.images.url_2x;
            }
            console.log(channelEmotes);
            return channelEmotes;
        });
    }

}

Emotes.getGlobalEmotes();