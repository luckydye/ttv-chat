import IRCChatClient, { JoinMessage, PartMessage } from './services/IRCChatClient';
import TwitchPubsub from './services/twitch/Pubsub';
import TwitchAPI from './services/Twitch';
import Account from './Account';

export default class Channel {

    // contains all the per channel logic like message handling n stuff

    channel_login: string | null = null;
    channel_id: string | null = null;
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

    constructor(account: Account) {
        this.account = account;
        // join the chat 
            // and gather information about the channel in parallel
    }

    onJoin() {
        // put connected in the chat
    }

    onPart() {
        // put disconnected in the chat
    }

    joinIRC() {
        IRCChatClient.listen('chat.joined', (msg: JoinMessage) => {
            if(msg.channel_login == this.channel_login && msg.user_login == this.account.user_login) {
                console.log("Joined ", this.channel_login);
                this.chat_connected = true;
                this.onJoin();
            }
        });
        IRCChatClient.listen('chat.parted', (msg: PartMessage) => {
            if(msg.channel_login == this.channel_login) {
                console.log("Parted ", this.channel_login && msg.user_login == this.account.user_login);
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

}
