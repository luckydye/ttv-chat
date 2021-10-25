import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import { rgbToHex } from '../utils';

interface ChatTransport {
    message: string,
    sender: string,
    channel: string,
    is_action: Boolean,
    badges: Array<object>,
    badge_info: Array<object>,
    bits: number,
    name_color: Array<number>,
    // emotes: vec![],
    server_timestamp: string,
}

export interface ChatMessage {
    username: string,
    message: string,
    color: string,
    timestamp: Date
}

// bindings to the rust api
export default class IRCChatClient {

    static connectoToChat(username: string, token: string) {
        invoke('connect_to_chat', {
            username: username,
            token: token
        })
            .catch((e) => console.error);
    }

    static joinChatRoom(channel: string) {
        return invoke('chat_join_room', {
            channel,
        })
            .catch((e) => console.error)
    }

    static async listen(callback: Function) {
        return listen('chat.message', event => {
            if(event.payload) {
                const payload: ChatTransport = event.payload as ChatTransport;
                // payload.channel seperation needed
                const message_data: ChatMessage = {
                    username: payload.sender,
                    message: payload.message,
                    color: rgbToHex(...payload.name_color),
                    timestamp: new Date(payload.server_timestamp)
                }
                callback(message_data);
            }
        })
    }

}