import { EmoteMap } from "./Emote";

export default class EmoteService {

    static get service_name(): string {
        return "emotes";
    }

    static get global_emotes(): EmoteMap {
        throw new Error('global_emotes getter not implemented');
    }

    static getGlobalEmotes(): Promise<EmoteMap | undefined> {
        throw new Error('getGlobalEmotes() not implemented');
    }

    static getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
        throw new Error('getChannelEmotes() not implemented');
    }

}