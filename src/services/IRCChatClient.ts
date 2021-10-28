import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import { rgbToHex } from '../utils';

interface ChatTransport {
    id: string,
    message: string,
    sender: string,
    sender_id: string,
    channel: string,
    is_action: Boolean,
    badges: Array<object>,
    badge_info: Array<object>,
    bits: number,
    name_color: Array<number>,
    emotes: Array<any>,
    server_timestamp: string,
}

export interface ChatClearMessage {
    id: string,
    message: string,
    sender: string,
    channel: string,
    is_action: Boolean,
    server_timestamp: string,
}

export interface ChatMessage {
    id: string,
    channel: string,
    username: string,
    sender_id: string,
    message: string,
    color: string,
    badges: Array<object>,
    timestamp: Date,
    is_action: Boolean,
    emotes: Array<any>,
}

export interface ChatUser {
    channel: string,
    username: string,
    badges: Array<object>,
    badge_info: Array<object>,
    name_color: Array<number>,
}

export interface UserState {
    channel: string,
    username: string,
    badges: Array<object>,
    color: string,
}

const listeners = new Map();

// bindings to the rust api
export default class IRCChatClient {

    static user: UserState | null = null;
    static usermap = {};

    static connectoToChat(username: string, token: string) {
        return invoke('connect_to_chat', {
            username: username,
            token: token
        })
            .catch((e) => console.error);
    }

    static joinChatRoom(channel: string) {
        return invoke('chat_join_room', {
            channel,
        }).catch((e) => console.error)
    }

    static partChatRoom(channel: string) {
        return invoke('chat_leave_room', {
            channel,
        }).catch((e) => console.error)
    }

    static sendMessage(channel: string, message: string) {
        return invoke('chat_send_message', {
            channel,
            message,
        })
            .then(e => {
                // loop message back to display in chat
                for(let callback of listeners.get("chat.message")) {
                    if(!this.usermap[channel]) {
                        throw new Error('User not listed');
                    }
                    const user = this.usermap[channel];
                    const message_data: ChatMessage = {
                        id: "-1",
                        username: user.username || "user not found",
                        sender_id: user.id,
                        channel: channel,
                        is_action: false,
                        badges: user.badges || [],
                        message: message,
                        color: user.color,
                        timestamp: new Date()
                    }
                    callback(message_data);
                }

                console.log('message sent');
            })
            .catch((e) => console.error(e))
    }

    static async listen(eventName: string, callback: Function) {

        if(!listeners.has(eventName)) {
            listeners.set(eventName, new Set());
        }
        listeners.get(eventName).add(callback);

        return listen(eventName, event => {
            switch(eventName) {
                case 'chat.state': {
                    if (event.payload) {
                        callback(event.payload);
                    }
                    break;
                }
                case 'chat.message': {
                    if (event.payload) {
                        const payload: ChatTransport = event.payload as ChatTransport;
                        // payload.channel seperation needed
                        const message_data: ChatMessage = {
                            id: payload.id,
                            channel: payload.channel,
                            username: payload.sender,
                            sender_id: payload.sender_id,
                            is_action: payload.is_action,
                            badges: payload.badges,
                            message: payload.message,
                            color: rgbToHex(...payload.name_color),
                            timestamp: new Date(payload.server_timestamp),
                            emotes: payload.emotes
                        }
                        callback(message_data);
                    }
                    break;
                }
                case 'chat.user': {
                    if (event.payload) {
                        const payload: ChatUser = event.payload as ChatUser;
                        const message_data: UserState = {
                            channel: payload.channel,
                            username: payload.username,
                            badges: payload.badges,
                            color: rgbToHex(...payload.name_color),
                        };
                        this.usermap[payload.channel] = message_data;
                        callback(message_data);
                    }
                    break;
                }
                case 'chat.info': {
                    if (event.payload) {
                        const payload: ChatTransport = event.payload as ChatTransport;
                        const message_data: ChatMessage = {
                            id: payload.id,
                            channel: payload.channel,
                            username: payload.sender,
                            sender_id: payload.sender_id,
                            is_action: payload.is_action,
                            badges: payload.badges,
                            message: payload.message,
                            color: rgbToHex(...payload.name_color),
                            timestamp: new Date(payload.server_timestamp),
                            emotes: payload.emotes
                        }
                        callback(message_data);
                    }
                    break;
                }
                case 'chat.clear': {
                    if (event.payload) {
                        const payload: ChatClearMessage = event.payload as ChatClearMessage;
                        callback(payload);
                    }
                    break;
                }
                default: {
                    if (event.payload) {
                        callback(event.payload);
                    }
                    break;
                }
            }
        })
    }

}