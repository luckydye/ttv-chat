import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import { hexToRgb, rgbToHex, limitColorContrast } from './utils';
import { Application } from './App';

// message types
import { EventMessage, UserMessage } from './MessageParser';

export interface ChatClearMessage {
    id: string,
    message: string,
    sender: string,
    channel: string,
    is_action: Boolean,
    server_timestamp: string,
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

    // appearence of the local user in different chat rooms
    static usermap: { [key: string]: UserState } = {};

    static async connectoToChat(username: string, token: string) {
        return invoke('connect_to_chat', {
            username: username,
            token: token
        })
            .catch((e) => console.error(e));
    }

    static async getUserlist(channel: string) {
        return invoke('get_userlist', {
            channel,
        })
            .then((text: any) => JSON.parse(text))
            .catch((e) => console.error(e))
    }

    static async joinChatRoom(channel: string) {
        return invoke('chat_join_room', {
            channel,
        }).catch((e) => console.error(e))
    }

    static async partChatRoom(channel: string) {
        return invoke('chat_leave_room', {
            channel,
        }).catch((e) => console.error(e))
    }

    static async sendMessage(channel: string, message: string) {
        return invoke('chat_send_message', {
            channel,
            message,
        })
            .then(e => {
                if(message[0] !== "/") {
                    // loop message back to display in chat if its not a command
                    if(!this.usermap[channel]) {
                        console.error('User not listed');
                    }
                    const user = this.usermap[channel];
                    const message_data: UserMessage = {
                        channel: channel,
                        message_type: 'user',
                        id: Math.floor(Math.random() * 100000000000).toString(),
                        text: message,
                        user_name: user.username || "user not found",
                        user_id: "chat-client",
                        color: hexToRgb(user.color),
                        emotes: [],
                        badges: user.badges || [],
                        timestamp: new Date(),
                        is_action: false,
                        bits: 0,
                        tags: {
                            "room-id": Application.getChannelId(channel),
                        },
                    }

                    for(let callback of listeners.get("chat.message")) {
                        callback(message_data);
                    }
                }

                console.log('message sent');
            })
            .catch((e) => console.error(e))
    }

    static async sendCommand(channel: string, message: string) {
        return invoke('chat_send_message', {
            channel,
            message,
        })
            .then(e => {
                console.log('command sent');
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
                case 'chat.user': {
                    if (event.payload) {
                        const payload: ChatUser = event.payload as ChatUser;
                        const message_data: UserState = {
                            channel: payload.channel,
                            username: payload.username,
                            badges: payload.badges,
                            color: rgbToHex(limitColorContrast(...payload.name_color)),
                        };
                        this.usermap[payload.channel] = message_data;
                        return callback(message_data);
                    }
                    break;
                }
                case 'chat.clear': {
                    if (event.payload) {
                        return callback(event.payload as ChatClearMessage);
                    }
                    break;
                }
                case 'chat.message': {
                    return callback(event.payload as UserMessage);
                }
                case 'chat.info': {
                    return callback(event.payload as EventMessage);
                }
                case 'chat.state': {
                    if (event.payload) {
                        return callback(event.payload);
                    }
                    break;
                }
                default: {
                    if (event.payload) {
                        // proxy for unknown event types
                        return callback(event.payload);
                    }
                    break;
                }
            }
        })
    }

}