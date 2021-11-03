import IRC, { IRCEvents, JoinMessage, PartMessage } from './services/IRC';
import TwitchPubsub from './services/twitch/Pubsub';
import TwitchApi, { UserInfo } from './services/twitch/Api';
import Application from './App';
import Account from './Account';
import Focus from './Focus';
import MessageParser, { ChatMessage, EventMessage, UserMessage, ChatInfoMessage } from './MessageParser';
import TwitchChat from './components/TwitchChat';
import ChannelInfoChanged from './events/ChannelInfoChanged';


export default class Channel {

    // contains all the per channel logic like message handling n stuff

    messageParser: MessageParser;

    channel_login: string;
    channel_id: string;
    profile_image_url: string | undefined;
    is_live: boolean = false;
    channel_description: string = "";

    chat_connected: boolean = false;

    r9k = false;
    subscribers_only = false;
    emote_only = false;
    follwers_only = 0;
    slow_mode = 0;
    chatter_count = 0;
    channel_view_count: number = 0;

    slowmode_time = 10;
    followermode_time = 10;

    moderator = false;
    broadcaster = false;

    mod_pubsub: TwitchPubsub;
    account: Account;

    chat: TwitchChat;

    constructor(channel_name: string) {
        this.channel_login = channel_name;
        this.messageParser = new MessageParser(this);

        this.chat = document.createElement('twitch-chat') as TwitchChat;
        this.chat.setRoom(this.channel_login);

        this.joinIRC();

        // join the chat 
        // and gather information about the channel in parallel


        // pubsub = await TwitchApi.connectToPubSub();
        // pubsub_features = await TwitchApi.connectToPubSub();
        // setTimeout(() => {
        //     pubsub.loadRedemtionHistory()
        // }, 500);

        // bookmark placements
        Focus.onBlur(() => {
            if(Application.getSelectedChannel() == this.channel_login) {
                this.chat.placeBookmarkLine();
            }
        });
        Focus.onFocus(() => {
            if(Application.getSelectedChannel() == this.channel_login) {
                this.chat.removeBookmarkLine();
            }
        });

        // get all the info out of the twitch api
        this.getChannelInfo().then(info => {
            if(!info) return;

            this.channel_id = info.id;
            this.profile_image_url = info.profile_image_url;
            this.channel_view_count = info.view_count;
            this.channel_description = info.description;

            this.fetchChannelStatus();
            this.fetchChannelBio().then(bio => {
                this.chat.setBio(bio);
            })

            setInterval(() => {
                this.fetchChannelStatus();
            }, 1000 * 30);
        })
    }

    async fetchChannelBio() {
        return TwitchApi.getChannel(this.channel_id).then((channel) => {
            return channel[0];
        });
    }

    async fetchChannelStatus() {
        if(!this.channel_id) throw new Error('requested channel status without id.');
        // Stream
        const stream = await TwitchApi.getStreams(this.channel_id);

        if (stream[0]) {
            this.is_live = true;

            // const {
            //     viewer_count,
            //     started_at,
            //     game_name,
            //     title
            // } = stream[0];

            this.chat.setTitle(stream[0]);
        } else {
            this.is_live = false;
        }

        await IRC.getUserlist(this.channel_login).then(chatters => {
            this.chatter_count = chatters.chatter_count;
        });

        window.dispatchEvent(new ChannelInfoChanged(this));
    }

    async getChannelInfo(): Promise<UserInfo | undefined> {
        if (this.channel_login) {
            return TwitchApi.getUserInfo(this.channel_login).then(info => {
                return info;
            })
        }
        return undefined;
    }

    async getStream() {
        if (this.channel_id) {
            return (await TwitchApi.getStreams(this.channel_id))[0];
        }
    }

    onJoin(msg: JoinMessage) {
        console.log("Joined ", msg.channel_login);
        this.chat_connected = true;
        this.chat.appendNote("Connected to " + msg.channel_login);
    }

    onPart(msg: PartMessage) {
        console.log("Parted ", msg.channel_login);
        this.chat_connected = false;
        this.chat.appendNote("Disconnected from " + msg.channel_login);
    }

    joinIRC() {
        this.chat.appendNote(`Connecting`);

        IRC.listen(IRCEvents.Joined, (msg: JoinMessage) => {
            const acc = Application.getCurrentAccount();
            if (msg.channel_login == this.channel_login && msg.user_login == acc.user_login) {
                this.onJoin(msg);
            }
        });
        IRC.listen(IRCEvents.Parted, (msg: PartMessage) => {
            const acc = Application.getCurrentAccount();
            if (msg.channel_login == this.channel_login) {
                this.onPart(msg);
            }
        });
        IRC.listen(IRCEvents.UserState, (msg) => {
            if (msg.channel === this.channel_login) {
                this.moderator = msg.badges.find(b => b.name == "moderator") !== undefined;
                this.broadcaster = msg.badges.find(b => b.name == "broadcaster") !== undefined;

                // PubSub for mod stuff
                if (!this.mod_pubsub && (this.moderator || this.broadcaster)) {
                    // mod events

                    // set it to ture so this code doesnt execute multiple times
                    this.mod_pubsub = true;

                    TwitchApi.connectToPubSub().then(pubsub => {
                        this.mod_pubsub = pubsub;

                        // TODO: dont do this here, do it bevore joining at all.
                        const user_id = Application.getCurrentAccount().user_id;
                        this.mod_pubsub.listen([
                            `chat_moderator_actions.${user_id}.${this.channel_id}`,
                            // `automod-queue.${user_id}.${this.channel_id}`
                        ]);

                        this.mod_pubsub.onModAction(data => {
                            // this.chat.appendNote(data.message);
                        });
                    })

                }
            }
        })
        IRC.listen(IRCEvents.ChatState, msg => {
            if (msg.channel_login == this.channel_login) {
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
            }
        });

        //
        // IRC shit
        // move this into the chat element
        //   or maybe move all of this irc logic out of the chat *Element* and put it somwhere else?
        IRC.listen('chat.message', async (msg: UserMessage) => {
            if(this.channel_login !== msg.channel) return;

            const chat = this.chat;
            const chatMessages = this.messageParser.parse(msg);

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
            if(this.channel_login !== msg.channel) return;

            const chatMessages = this.messageParser.parse(msg);

            for (let msg of chatMessages) {
                switch (msg.type) {
                    case "info":
                        this.chat.appendInfo(msg);
                        break;
                    case "message":
                        msg.highlighted = true;
                        if (msg.tagged) {
                            const mentionChat = Application.getChats("@");
                            mentionChat.appendMessage(msg);
                        }
                        this.chat.appendMessage(msg);
                        break;
                }
            }
        });

        IRC.listen(IRCEvents.ChatNote, (msg) => {
            if(this.channel_login !== msg.channel_login) return;

            this.chat.appendNote(msg.message_text);
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
            if (this.channel_login === msg.channel_login) {
                const chat = this.chat;
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

        IRC.joinChatRoom(this.channel_login.toLocaleLowerCase());
    }

    toggleSlowMode() {
        if (this.moderator || this.broadcaster) {
            if (this.slow_mode) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/slowoff");
            } else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/slow " + this.slowmode_time);
            }
        }
    }

    toggleFollowerMode() {
        if (this.moderator || this.broadcaster) {
            if (this.follwers_only) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/followersoff");
            } else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/followers " + this.followermode_time);
            }
        }
    }

    toggleEmoteOnlyMode() {
        if (this.moderator || this.broadcaster) {
            if (this.emote_only) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/emoteonlyoff");
            } else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/emoteonly");
            }
        }
    }

    toggleSubOnlyMode() {
        if (this.moderator || this.broadcaster) {
            if (this.subscribers_only) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/subscribersoff");
            } else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/subscribers");
            }
        }
    }

    toggleR9kMode() {
        if (this.moderator || this.broadcaster) {
            if (this.r9k) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/r9kbetaoff");
            } else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/r9kbeta");
            }
        }
    }

    static findReward(id: string) {
        if (twitch_pubsub) {
            return twitch_pubsub.rewards[id];
        }
    }

    getMessageById(channel:string, message_id: string) {
        const channels = Application.getChannels();
        for(let channel of channels) {
            const ch = Application.getChannel(channel);
            if(ch) {
                const chat = ch.chat;
                const msg = chat.querySelector(`[messageid="${message_id}"]`);

                console.log(msg);
                
                return msg ? msg.message : undefined;
            }
        }
    }

    reply(channel: string, message: ChatMessage) {
        Application.selectRoom(channel);
        const input = document.querySelector('chat-input');
        input.insert(message.user_name + ', ');
        input.focus();
        // message.id
        // also place the message id as parent message into the sumbited message
    }

    timeout(channel: string, user_name: string, secs: number) {
        IRC.sendMessage(channel, this.channel_id, `/timeout ${user_name} ${secs}`);
    }

    unban(channel: string, user_name: string) {
        IRC.sendMessage(channel, this.channel_id, `/unban ${user_name}`);
    }

    openUserCard(user_name: string) {
        const url = `https://www.twitch.tv/popout/${this.channel_login}/viewercard/${user_name}`;
        open(url);
    }

}
