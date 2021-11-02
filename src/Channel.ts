import IRCChatClient, { IRCEvents, JoinMessage, PartMessage } from './services/IRC';
import TwitchPubsub from './services/twitch/Pubsub';
import TwitchAPI from './services/twitch/Api';
import Application from './App';
import Account from './Account';

export default class Channel {

    // contains all the per channel logic like message handling n stuff

    channel_login: string | undefined;
    channel_id: string | undefined;
    chat_connected: boolean = false;

    r9k = false;
    subscribers_only = false;
    emote_only = false;
    follwers_only = 0;
    slow_mode = 0;
    chatter_count = 0;

    slowmode_time = 10;
    followermode_time = 10;

    moderator = false;
    broadcaster = false;

    mod_pubsub: TwitchPubsub;

    account: Account;

    constructor(channel_name: string) {
        this.channel_login = channel_name;
        
        // join the chat 
        // and gather information about the channel in parallel


        // pubsub = await TwitchAPI.connectToPubSub();
        // pubsub_features = await TwitchAPI.connectToPubSub();

        return this;

        // create chats
        for (let channel of Application.getChannels()) {
            createChat(channel);
        }

        // custom mentions channel
        chatElements["@"] = document.createElement("sample-chat");
        chatElements["@"].setRoom("Mentions");

        Application.setChats(chatElements);

        window.addEventListener('addedroom', e => {
            createChat(e.room_name);
        });
        window.addEventListener('closeroom', e => {
            IRC.partChatRoom(e.room_name);
            delete chatElements[e.room_name];
        });

        window.addEventListener('selectroom', e => {
            renderSelecetdChat();
        });

        //
        // IRC shit
        // move this into the chat element
        //   or maybe move all of this irc logic out of the chat *Element* and put it somwhere else?
        IRC.listen('chat.message', async (msg: UserMessage) => {
            const chat = chatElements[msg.channel];
            const chatMessages = MessageParser.parse(msg);

            if (chat) {
                for (let msg of chatMessages) {
                    if (msg.tagged) {
                        const mentionChat = Application.getChats("@");
                        mentionChat.appendMessage(msg);
                    }

                    chat.appendMessage(msg);
                }
            }
        });

        IRC.listen('chat.info', (msg: EventMessage) => {
            const chat = chatElements[msg.channel];
            const chatMessages = MessageParser.parse(msg);

            if (chat) {
                for (let msg of chatMessages) {
                    switch (msg.type) {
                        case "info":
                            chat.appendInfo(msg);
                            break;
                        case "message":
                            msg.highlighted = true;
                            if (msg.tagged) {
                                const mentionChat = Application.getChats("@");
                                mentionChat.appendMessage(msg);
                            }
                            chat.appendMessage(msg);
                            break;
                    }
                }
            }
        });

        IRC.listen(IRCEvents.ChatNote, (msg) => {
            const chat = chatElements[msg.channel_login];
            if (chat) {
                chat.appendNote(msg.message_text);
            }
            chat.update();
        });

        interface ClearChatAction {
            UserBanned: {
                user_login: string,
                user_id: string,
            },
            UserTimedOut: {
                user_login: string,
                user_id: string,
                timeout_length: number,
            }
        }

        interface ClearChatMessage {
            channel_login: string,
            channel_id: string,
            action: ClearChatAction,
            server_timestamp: Date,
        }

        IRC.listen(IRCEvents.ChatClear, (msg: ClearChatMessage) => {
            const chat = chatElements[msg.channel_login];

            if (chat) {
                const action = msg.action.UserBanned || msg.action.UserTimedOut;
                const lines = chat.querySelectorAll(`[userid="${action.user_id}"]`);
                for (let line of [...lines]) {
                    line.setAttribute("deleted", "");
                }

                if (msg.action.UserBanned) {
                    // got banned
                    chat.appendNote(`${action.user_login} got banned.`);
                }
                if (msg.action.UserTimedOut) {
                    // got timed out for xs
                    chat.appendNote(`${action.user_login} got timed out for ${Format.seconds(action.timeout_length.secs)}.`);
                }
            }
        });
        //
        // IRC shit END
        //

        setTimeout(() => {
            pubsub.loadRedemtionHistory()
        }, 500);

        // bookmark placements
        Focus.onBlur(() => {
            const active_chat = Application.getChats(Application.getSelectedRoom());
            if (active_chat) {
                active_chat.placeBookmarkLine();
            }
        });
        Focus.onFocus(() => {
            const active_chat = Application.getChats(Application.getSelectedRoom());
            active_chat.removeBookmarkLine();
        });
    }

    async getProfileImage(): Promise<string> {
        if(this.channel_login) {
            return TwitchAPI.getUserInfo(this.channel_login).then(info => {
                if(info) {
                    this.channel_id = info.id;
                    return info.profile_image_url;
                } else {
                    return "";
                }
            })
        }
        return "";
    }

    async getStream() {
        if(this.channel_id) {
            return (await TwitchAPI.getStreams(this.channel_id))[0];
        }
    }

    onJoin() {
        // put connected in the chat
    }

    onPart() {
        // put disconnected in the chat
    }

    joinIRC() {
        IRCChatClient.listen('chat.joined', (msg: JoinMessage) => {
            const acc = Application.getCurrentAccount();
            if (msg.channel_login == this.channel_login && msg.user_login == acc.user_login) {
                console.log("Joined ", this.channel_login);
                this.chat_connected = true;
                this.onJoin();
            }
        });
        IRCChatClient.listen('chat.parted', (msg: PartMessage) => {
            const acc = Application.getCurrentAccount();
            if (msg.channel_login == this.channel_login) {
                console.log("Parted ", this.channel_login && msg.user_login == acc.user_login);
                this.chat_connected = false;
                this.onPart();
            }
        });

        IRCChatClient.listen('chat.user', (msg) => {
            if (msg.channel === this.channel_login) {
                this.moderator = msg.badges.find(b => b.name == "moderator") !== undefined;
                this.broadcaster = msg.badges.find(b => b.name == "broadcaster") !== undefined;

                // PubSub for mod stuff
                if (!this.mod_pubsub && (this.moderator || this.broadcaster)) {
                    // mod events

                    // set it to ture so this code doesnt execute multiple times
                    this.mod_pubsub = true;

                    TwitchAPI.connectToPubSub().then(pubsub => {
                        this.mod_pubsub = pubsub;

                        // TODO: dont do this here, do it bevore joining at all.
                        const user_id = TwitchAPI.getCurrentUser().id;
                        this.mod_pubsub.listen([
                            `chat_moderator_actions.${user_id}.${this.channel_id}`,
                            // `automod-queue.${user_id}.${this.channel_id}`
                        ]);

                        this.mod_pubsub.onModAction(data => {
                            // this.appendNote(data.message);
                        });
                    })

                }
            }
        })

        IRCChatClient.listen('chat.state', msg => {
            if (msg.channel_login == this.roomName) {
                if (msg.r9k !== null) {
                    this.r9k = msg.r9k;
                }
                if (msg.subscribers_only !== null) {
                    this.subscribers_only = msg.subscribers_only;
                }
                if (msg.emote_only !== null) {
                    this.emote_only = msg.emote_only;
                }
                if (msg.follwers_only !== null) {
                    this.follwers_only = msg.follwers_only !== "Disabled" ? msg.follwers_only.Enabled.secs : 0;
                    if (this.followermode_time === 0) {
                        this.followermode_time = this.follwers_only / 60;
                    }
                }
                if (msg.slow_mode !== null) {
                    this.slow_mode = msg.slow_mode.secs;
                    if (this.slowmode_time === 0) {
                        this.slowmode_time = this.slow_mode;
                    }
                }
                this.update();

                if (!this.connect) {
                    this.appendNote(`Connected to ${this.roomName}`);
                    this.updateChatterCount();

                    this.connect = true;
                }
            }
        });
    }

    static findReward(id: string) {
        if (twitch_pubsub) {
            return twitch_pubsub.rewards[id];
        }
    }

    // static openThread(channel: string, message_id: string) {
    //     const msg = document.querySelector(`[messageid="${message_id}"]`);
    //     if(msg) {
    //         const message = msg.message;

    //         const chat2 = document.createElement('sample-chat');
    //         chat2.appendMessage(message);

    //         chat2.style.position = "fixed";
    //         chat2.style.top = "auto";
    //         chat2.style.bottom = "100px";
    //         chat2.style.left = "40px";
    //         chat2.style.width = "100%";
    //         chat2.style.height = "100px";
    //         chat2.style.background = "#333";
            
    //         document.body.append(chat2);
    //     }
    // }

    // static getMessageById(channel:string, message_id: string) {
    //     const chat = this.getChats(channel);
    //     const msg = chat.querySelector(`[messageid="${message_id}"]`);
    //     return msg ? msg.message : undefined;
    // }

    // static reply(channel: string, message: ChatMessage) {
    //     Application.selectRoom(channel);
    //     const input = document.querySelector('chat-input');
    //     input.insert(message.user_name + ', ');
    //     input.focus();
    //     // message.id
    //     // also place the message id as parent message into the sumbited message
    // }

    // static timeout(channel: string, user_name: string, secs: number) {
    //     IRC.sendMessage(channel, `/timeout ${user_name} ${secs}`);
    // }

    // static unban(channel: string, user_name: string) {
    //     IRC.sendMessage(channel, `/unban ${user_name}`);
    // }

    // static openUserCard(channel: string, user_name: string) {
    //     const url = `https://www.twitch.tv/popout/${channel}/viewercard/${user_name}`;
    //     open(url);
    // }

}
