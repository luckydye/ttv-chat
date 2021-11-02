import EmoteService from './EmoteService';
import { Emote, EmoteMap } from './Emote';

let globalEmotes: EmoteMap = {};

export class FFZEmote extends Emote {
    static get url_template() {
        return "https://cdn.frankerfacez.com/emote/{{id}}/{{scale}}";
    }
    static get scale_template() {
        return {
            x1: "1",
            x2: "2",
            x3: "3",
        }
    }
}

export default class FFZEmotes extends EmoteService {

    static get service_name(): string {
        return "ffz";
    }

    static get global_emotes() {
        return globalEmotes;
    }

    static async getGlobalEmotes(): Promise<EmoteMap | undefined> {
        return undefined;
    }

    static async getChannelEmotes(id: string): Promise<EmoteMap | undefined> {
        return fetch("https://api.frankerfacez.com/v1/room/id/" + id)
            .then(res => res.json())
            .then(data => {
                if(data.sets) {
                    const channelEmotes: EmoteMap = {};
                    for(let set in data.sets) {
                        for (let emote of data.sets[set].emoticons) {
                            channelEmotes[emote.name] = new FFZEmote(emote);
                        }
                    }
                    return channelEmotes;
                }
            });
    }

}
