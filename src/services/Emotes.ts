import TwitchEmotes from './emotes/TwitchEmotes';
import BTTVEmotes from './emotes/BTTVEmotes';
import FFZEmotes from './emotes/FFZEmotes';
import SevenTVEmotes from './emotes/SevenTVEmotes';

let globalEmotes: { [key: string]: any } = {};
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
        return globalEmotes;
    }

    static getGlobalEmote(name: string) {
        return globalEmotes[name];
    }

    static async getGlobalEmotes() {
        const maps = await Promise.all([...EMOTE_SERVICES].map(Service => Service.getGlobalEmotes()));
        globalEmotes = flattenMap(maps);
        return globalEmotes;
    }

    static async getChannelEmotes(id: string) {
        const maps = await Promise.all([...EMOTE_SERVICES].map(Service => Service.getChannelEmotes(id)));
        return flattenMap(maps);
    }

}

Emotes.getGlobalEmotes();