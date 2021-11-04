import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import Color from '../util/Color';

// message types
import { EventMessage, UserMessage } from '../MessageParser';

export const IRCEvents = {
    Joined: 'chat.joined',
    Parted: 'chat.parted',
    UserState: 'chat.user',
    ChatState: 'chat.state',
    ChatClear: 'chat.clear',
    ChatInfo: 'chat.info',
    ChatNote: 'chat.notice',
    ChatMessage: 'chat.message',
    ChatDeleteMessage: 'chat.delete.message',
}

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
    emote_sets: Array<number>
}

export interface UserState {
    channel: string,
    username: string,
    badges: Array<object>,
    color: string,
    emote_sets: Array<number>
}

export interface JoinMessage {
    channel_login: string,
    user_login: string,
}

export interface PartMessage {
    channel_login: string,
    user_login: string,
}

const listeners = new Map();

// bindings to the rust api
export default class IRC {

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

    static async sendMessage(channel_login: string, channel_id: string, message: string, reply_message_id?: string) {
        const loopBackMessage = e => {
            if(message[0] !== "/") {
                // loop message back to display in chat if its not a command
                if(!this.usermap[channel_login]) {
                    console.error('User not listed');
                }
                const user = this.usermap[channel_login];
                const message_data: UserMessage = {
                    channel: channel_login,
                    message_type: 'user',
                    id: Math.floor(Math.random() * 100000000000).toString(),
                    text: message,
                    user_name: user.username || "user not found",
                    user_id: "chat-client",
                    color: Color.hexToRgb(user.color),
                    emotes: [],
                    badges: user.badges || [],
                    timestamp: new Date(),
                    is_action: false,
                    bits: 0,
                    tags: {
                        "room-id": channel_id,
                        "reply-parent-msg-id": reply_message_id != undefined ? reply_message_id : null
                    },
                }

                for(let callback of listeners.get("chat.message")) {
                    callback(message_data);
                }
            }

            console.log('message sent');
        };

        if(reply_message_id != undefined) {
            return invoke('chat_reply', {
                channel: channel_login, 
                messageId: reply_message_id, 
                message: message
            })
                .then(loopBackMessage)
                .catch((e) => console.error(e))
        } else {
            return invoke('chat_send_message', {
                channel: channel_login,
                message,
            })
                .then(loopBackMessage)
                .catch((e) => console.error(e))
        }
    }

    static async replyToMessage(channel_login: string, channel_id: string, message: string, message_id: string) {
        return this.sendMessage(channel_login, channel_id, message, message_id);
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
                            color: Color.rgbToHex(Color.limitColorContrast(...payload.name_color)),
                            emote_sets: payload.emote_sets
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
                case 'chat.delete.message': {
                    return callback(event.payload);
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
                case 'chat.joined': {
                    if (event.payload) {
                        return callback(event.payload as JoinMessage);
                    }
                    break;
                }
                case 'chat.parted': {
                    if (event.payload) {
                        return callback(event.payload as PartMessage);
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