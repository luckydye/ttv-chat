// Parse incoming messages into html´´ templates.
import { html, TemplateResult } from 'lit-element';
import Badges from './services/Badges';
import Emotes from './services/Emotes';
import TwitchEmotes from './services/emotes/TwitchEmotes';
import { getLoggedInUsername } from './services/Twitch';
import Webbrowser from './Webbrowser';
import { limitColorContrast, rgbToHex } from './utils';
import { Application } from './App';
import TwitchAPI from './services/Twitch';

const Default_EventMessage_Color = "rgb(12, 12, 12)";
const ColorEventTypeMap = {
    "SubOrResub": "rgb(33, 27, 37)",
    "Raid": "rgb(33, 27, 37)",
    "SubGift": "rgb(33, 27, 37)",
    "SubMysteryGift": "rgb(33, 27, 37)",
    "AnonSubMysteryGift": "rgb(33, 27, 37)",
    "GiftPaidUpgrade": "rgb(33, 27, 37)",
    "AnonGiftPaidUpgrade": "rgb(33, 27, 37)",
    "Ritual": "rgb(33, 27, 37)",
    "BitsBadgeTier": "rgb(33, 27, 37)",
}

///////////////
// types going into the parser

interface CharRange {
    start: number,
    end: number,
}

interface Emote {
    id: string,             // emote id
    char_range: CharRange,  // chat range of emote word
    name: string,           // emote name
}

interface Badge {
    id: string              // badge id
    name: string,           // badge name
    version: number,        // badge version
    description: string,    // badge description (like 5 months sub)
}

interface Event {
    id: string,
    data: object,
    type:
    "SubOrResub" |
    "Raid" |
    "SubGift" |
    "SubMysteryGift" |
    "AnonSubMysteryGift" |
    "GiftPaidUpgrade" |
    "AnonGiftPaidUpgrade" |
    "Ritual" |
    "BitsBadgeTier",
}

export interface UserMessage {
    message_type: 'user',
    id: string,             // message id
    text: string,           // user message
    channel: string,        // channel
    user_name: string,      // username
    user_id: string,        // user id
    color: Array<number>,   // username color
    emotes: Array<Emote>,   // emotes
    badges: Array<Badge>,   // badges + badge_info
    timestamp: Date,        // tmi server timestamp
    is_action: boolean,     // is /me message
    bits: number,           // amounts of bits attached to this message
    tags: { [key: string]: any },       // hgihlighted messages etc.
}

export interface EventMessage {
    message_type: 'event',
    id: string,                 // message id
    text: string,               // system text
    message: UserMessage | null,// attatched user message
    channel: string,            // channel
    timestamp: Date,            // tmi server timestamp
    event: Event | null,        // event causing this message
}

//
////////

///////////////
// types coming out of the parser

export interface ChatMessage {
    type: 'message',
    id: string,                 // message id
    user_name: string,
    user_id: string,
    highlighted: boolean,       // has hgihlighted tag
    tagged: boolean,            // the authenticated user got tagged
    action: boolean,            // is a /me message
    reply: boolean,             // is a reply
    timestamp: Date,
    text: string,
    content: TemplateResult,    // parsed message
}

export interface ChatInfoMessage {
    type: 'info',
    id: string,                 // message id
    background_color: string,   // custom msg background color for info type (sub, notice, etc.)
    timestamp: Date,
    content: TemplateResult,    // parsed message
}

//
//////

let channel_emote_map: { [key: string]: any } = {};
let channel_badge_map: { [key: string]: any } = {};

export default class MessageParser {

    // in short. recieve the network message and form into a client side representation.
    // like if its highligted, tagged or a reply...

    static parse(message: UserMessage | EventMessage): Array<ChatMessage | ChatInfoMessage> {
        if (message.message_type == "user") {
            return this.parseUserMessage(message);
        }
        if (message.message_type == "event") {
            return this.parseEventMessage(message);
        }
        return [];
    }

    static parseUserMessage(message: UserMessage): Array<ChatMessage> {
        return [
            this.parseChatTextMessage(message)
        ];
    }

    static parseEventMessage(message: EventMessage): Array<ChatMessage | ChatInfoMessage> {

        // null if no user message included
        const user = message.message ? this.parseChatTextMessage(message.message) : null;

        const event: ChatInfoMessage = {
            type: 'info',
            id: message.id,
            background_color: message.event ? ColorEventTypeMap[message.event.type] : Default_EventMessage_Color,
            timestamp: message.timestamp,
            content: html`
                <div class="line">
                    <div class="message">${message.text}</div>
                </div>
            `
        };

        return user == null ? [event] : [user, event];
    }

    static parseChatTextMessage(message: UserMessage): ChatMessage {

        const channel_id = message.tags['room-id'];
        const reward_id = message.tags['custom-reward-id'];

        let redemtion_title = "custom reward";

        if(reward_id) {
            const redemtion = TwitchAPI.findReward(reward_id);
            if(redemtion) {
                redemtion_title = redemtion.title;
            }
        }

        let color = rgbToHex(limitColorContrast(...message.color));
        let highlighted = message.tags['msg-id'] == "highlighted-message";
        let action = message.is_action;
        let timestamp = message.timestamp;
        let isReply = message.tags['reply-parent-msg-id'] != null;
        let tagged = false;

        const wordEmoteMap: { [key: string]: { name: string, url: string } } = {};
        const wordLinkMap: { [key: string]: string } = {};
        const wordMentionMap: { [key: string]: string } = {};

        // get cached channel badges
        let channel_badges = Badges.getChachedChannelBadges(channel_id);
        // get cached channel emotes
        let channel_emotes = Emotes.getChachedChannelEmotes(channel_id);

        // collect emotes (url) for this message
        if (message.emotes) {
            for (let emote of message.emotes) {
                const start = emote.char_range.start;
                const end = emote.char_range.end;

                const wordToReplace = message.text.slice(start, end);
                const emoteURL = TwitchEmotes.parseEmoteUrl(emote);

                wordEmoteMap[wordToReplace] = {
                    name: wordToReplace,
                    url: emoteURL,
                };
            }
        }

        const msg_words = message.text.split(" ");

        // find words to replace with 
        //  (3rd party emtoes | global emtoes | links | metions | msg tagged)
        msg_words.forEach(str => {
            // find channel emote repalcement
            // TODO: PROBLEM: it renders sub emotes for people that dont have those emotes lol
            if (str in channel_emotes) {
                wordEmoteMap[str] = {
                    name: str,
                    url: channel_emotes[str],
                };
            }
            // global emotes repalcement
            if (str in Emotes.global_emotes) {
                wordEmoteMap[str] = {
                    name: str,
                    url: Emotes.getGlobalEmote(str),
                };
            }
            // find link repalcement
            const urlMatch = Webbrowser.matchURL(str);
            if (urlMatch) {
                wordLinkMap[urlMatch[0]] = urlMatch[0];
            }
            // find mention repalcement
            if (str.match(/\@[a-zA-Z0-9]+/g)) {
                wordMentionMap[str] = str;
            }
            // find highlight mentions
            const client_user = getLoggedInUsername().toLocaleLowerCase();
            if (client_user != "" && str.toLocaleLowerCase().match(client_user)) {
                wordMentionMap[str] = str;
                tagged = true;
            }
        });

        const getSubBadge = (version: number) => {
            if (channel_badges["subscriber"]) {
                return channel_badges["subscriber"].versions[version].image_url_2x;
            }
        };

        const renderEmote = (emoteInfo: any) => {
            return html`<img class="emote" name="${emoteInfo.name}" alt="${emoteInfo.name}" src="${emoteInfo.url}" height="32"> `;
        };

        const renderLink = (linkInfo: string) => {
            return html`<a class="inline-link" href="javascript:()" @click="${() => {
                Webbrowser.openInBrowwser(linkInfo);
            }}">${linkInfo}</a> `;
        };

        const renderMention = (name: string) => {
            return html`<span class="mention">${name}</span> `;
        };

        // actually replace everything collected at once
        let parsed_msg = msg_words.map(word => {
            // replace emotes
            if (wordEmoteMap[word]) {
                return renderEmote(wordEmoteMap[word]);
            }
            // replace links
            if (wordLinkMap[word]) {
                return renderLink(wordLinkMap[word]);
            }
            // replace mentions
            if (wordMentionMap[word]) {
                return renderMention(wordMentionMap[word]);
            }
            return word + " ";
        });

        let line_title = reward_id ? `Redeemed ${redemtion_title}.` : null;

        if(isReply) {
            const parent_message = Application.getMessageById(message.channel, message.tags['reply-parent-msg-id']);
            if(parent_message) {
                line_title = `${parent_message.user_name}: ${parent_message.text}`;
            }
        }

        // render full message template
        const template = html`
            ${line_title ? html`
                <div class="line-title">${line_title}</div>
            ` : ''}
            <div class="line" style="--color: ${color}" ?action="${message.is_action}">
                <span class="bages">
                    ${message.badges.map(badge => {
                        let badge_url = "";

                        if (badge.name == "subscriber") {
                            badge_url = getSubBadge(badge.version) || Badges.getBadgeByName(badge.name, badge.version);
                            return html`<img class="badge" alt="${badge.name} (${badge.description})" src="${badge_url}" width="18" height="18">`;
                        }
                        
                        badge_url = Badges.getBadgeByName(badge.name, badge.version);
                        return html`<img class="badge" alt="${badge.name}" src="${badge_url}" width="18" height="18">`;
                    })}
                </span>
                <span class="username" @click="${() => Application.openUserCard(message.channel, message.user_name)}">${message.user_name}:</span>
                ${isReply && false ? html`
                    <button class="reply-icon" title="Open Thread" @click="${() => Application.openThread(message.channel, message.tags['reply-parent-msg-id'])}">
                        <img src="./images/question_answer_white_24dp.svg" height="18px" width="18px" />
                    </button>
                ` : ""}
                <span class="message">${parsed_msg}</span>
                
                <div class="tools">
                    <!-- //////// use PageOverlay for this? //////////-->
                    
                    <div class="chat-line-tool mention-tool" @click="${() => Application.selectRoom(message.channel)}" title="Jump to chat">
                        <img src="./images/navigate_before_white_24dp.svg" width="18px" height="18px" />
                    </div>
                    
                    ${message.user_name !== getLoggedInUsername() ? html`
                        <div class="chat-line-tool" title="Reply" @click="${() => Application.reply(message.channel, message)}">
                            <img src="./images/reply_white_24dp.svg" height="18px" width="18px" />
                        </div>
                        <div class="chat-line-tool mod-tool" title="Timeout 10s" @click="${() => Application.timeout(message.channel, message.user_name, 10)}">
                            <img src="./images/block_white_24dp.svg" width="18px" height="18px" />
                        </div>
                        <div class="chat-line-tool mod-tool-banned" title="Unban" @click="${() => Application.unban(message.channel, message.user_name)}">
                            <img src="./images/done_white_24dp.svg" width="18px" height="18px" />
                        </div>
                    ` : ""}
                </div>
            </div>
        `;

        return {
            type: 'message',
            id: message.id,
            user_name: message.user_name,
            user_id: message.user_id,
            highlighted: highlighted,
            tagged: tagged,
            action: action,
            reply: isReply,
            timestamp: timestamp,
            text: message.text,
            content: template,
        };
    }

}

