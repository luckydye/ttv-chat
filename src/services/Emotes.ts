import TwitchEmotes from './emotes/TwitchEmotes';
import BTTVEmotes from './emotes/BTTVEmotes';
import FFZEmotes from './emotes/FFZEmotes';
import SevenTVEmotes from './emotes/SevenTVEmotes';

let global_emotes: { [key: string]: any } = {};
let channel_emotes: { [key: string]: any } = {};

const EMOTE_SERVICES = [
    TwitchEmotes,
    BTTVEmotes,
    FFZEmotes,
    SevenTVEmotes
]

export default class Emotes {

    static get global_emotes() {
        return global_emotes;
    }

    static getGlobalEmote(name: string) {
        return global_emotes[name];
    }

    static async getGlobalEmotes() {
        return await Promise.all([...EMOTE_SERVICES].map(async Service => {
            const emotes = await Service.getGlobalEmotes();
            global_emotes[Service.service_name] = emotes;
        })).then(() => {
            return global_emotes;
        });
    }

    static getChachedChannelEmotes(channel_id: string) {
        if (!channel_emotes[channel_id]) {
            channel_emotes[channel_id] = {};
            Emotes.getChannelEmotes(channel_id);
        }
        return channel_emotes[channel_id];
    }

    static async getChannelEmotes(channel_id: string) {
        if(!channel_emotes[channel_id]) {
            channel_emotes[channel_id] = {};
        }

        return await Promise.all([...EMOTE_SERVICES].map(async Service => {
            const emotes = await Service.getChannelEmotes(channel_id);
            channel_emotes[channel_id][Service.service_name] = emotes;
        })).then(() => {
            return channel_emotes[channel_id];
        });
    }

}
