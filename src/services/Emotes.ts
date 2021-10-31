import TwitchEmotes from './emotes/TwitchEmotes';
import BTTVEmotes from './emotes/BTTVEmotes';
import FFZEmotes from './emotes/FFZEmotes';
import SevenTVEmotes from './emotes/SevenTVEmotes';

// TODO: Sort cached emotes by service for emote picker sorting
let global_emotes: { [key: string]: any } = {};
let channel_emotes: { [key: string]: {} } = {};
let emoteTemplate = "";

const EMOTE_SERVICES = [
    TwitchEmotes,
    BTTVEmotes,
    FFZEmotes,
    SevenTVEmotes
]

function flattenMap(arr: Array<object>) {
    let result = {};
    for(let map of arr) {
        result = Object.assign(result, map);
    }
    return result;
}

export default class Emotes {

    static get template() {
        return emoteTemplate;
    }

    static get global_emotes() {
        return global_emotes;
    }

    static getGlobalEmote(name: string) {
        return global_emotes[name];
    }

    static async getGlobalEmotes() {
        const maps = await Promise.all([...EMOTE_SERVICES].map(Service => Service.getGlobalEmotes()));
        global_emotes = flattenMap(maps);
        return global_emotes;
    }

    static getChachedChannelEmotes(channel_id: string) {
        if (!channel_emotes[channel_id]) {
            channel_emotes[channel_id] = {};
            Emotes.getChannelEmotes(channel_id);
        }
        return channel_emotes[channel_id];
    }

    static async getChannelEmotes(channel_id: string) {
        const maps = await Promise.all([...EMOTE_SERVICES].map(Service => Service.getChannelEmotes(channel_id)));
        channel_emotes[channel_id] = flattenMap(maps);
        return channel_emotes[channel_id];
    }

}

Emotes.getGlobalEmotes();