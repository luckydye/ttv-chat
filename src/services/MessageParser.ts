// Parse incoming messages into html´´ templates.
import { html, TemplateResult } from 'lit-element';
import { Application } from '../App';
import Badges from './Badges';
import Emotes from './Emotes';
import TwitchEmotes from './emotes/TwitchEmotes';
import { getLoggedInUsername } from './Twitch';
import Webbrowser from './Webbrowser';

///////////////
// types going into the parser

interface Emote {
    id: string,             // emote id
    char_range: number,     // chat range of emote word
    name: string,           // emote name
}

interface Badge {
    id: string              // badge id
    name: string,           // badge name
    description: string,    // badge description (like 5 months sub)
}

interface UserMessage {
    type: 'user',
    id: string,             // message id
    text: string,           // user message
    user_name: string,      // username
    user_id: string,        // user id
    color: string,          // username color
    emotes: Array<Emote>,   // emotes
    badges: Array<Badge>,   // badges + badge_info
    timestamp: Date,        // tmi server timestamp
    is_action: boolean,     // is /me message
    bits: number,           // amounts of bits attached to this message
    tags: Array<any>,       // hgihlighted messages etc.
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

const Default_EventMessage_Color = "rgb(12, 12, 12)";
const ColorEventTypeMap = {
    "SubOrResub":           "rgb(33, 27, 37)",
    "Raid":                 "rgb(33, 27, 37)",
    "SubGift":              "rgb(33, 27, 37)",
    "SubMysteryGift":       "rgb(33, 27, 37)",
    "AnonSubMysteryGift":   "rgb(33, 27, 37)",
    "GiftPaidUpgrade":      "rgb(33, 27, 37)",
    "AnonGiftPaidUpgrade":  "rgb(33, 27, 37)",
    "Ritual":               "rgb(33, 27, 37)",
    "BitsBadgeTier":        "rgb(33, 27, 37)",
}

interface EventMessage {
    type: 'event',
    id: string,             // message id
    text: string,           // system text
    message: UserMessage | null,   // attatched user message
    timestamp: Date,        // tmi server timestamp
    event: Event | null,           // event causing this message
}

//
////////

///////////////
// types coming out of the parser

interface ChatMessage {
    type: 'message',
    id: string,                 // message id
    user_name: string,
    user_id: string,
    highlighted: boolean,       // has hgihlighted tag
    tagged: boolean,            // the authenticated user got tagged
    action: boolean,            // is a /me message
    timestamp: Date,
    content: TemplateResult,    // parsed message
}

interface ChatInfo {
    type: 'info',
    id: string,                 // message id
    background_color: string,   // custom msg background color for info type (sub, notice, etc.)
    timestamp: Date,
    content: TemplateResult,    // parsed message
}

//
//////


export default class MessageParser {

    // TODO: parse messages here instead of the chat line element
    // parse it, get the information out of it, render it into a chatline element.
    // optionally send mentions to the mentions chat etc.

    // in short. recieve the network message and form into a client side representation.
    // like if its highligted, tagged or a reply...

    static parse(message: UserMessage | EventMessage): ChatMessage | ChatInfo {
        if (message.type == "user") {
            return this.parseUserMessage(message);
        }
        if (message.type == "event") {
            return this.parseEventMessage(message);
        }
    }

    static parseUserMessage(message: UserMessage): ChatMessage {
        const info: ChatMessage = {
            type: 'message',
            id: "123",
            timestamp: new Date(),
            content: html``
        };
        return info;
    }

    static parseEventMessage(message: EventMessage): ChatInfo {
        const info: ChatInfo = {
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
        return info;
    }

    static parseChatTextMessage(message: UserMessage) {
        const msg = message.text;

        const wordEmoteMap = {};
        const wordLinkMap = {};
        const wordMentionMap = {};

        let isReply = false;
        if (message.tags['reply-parent-msg-id']) {
            isReply = true;
        }

        if (message.emotes) {
            for (let emote of message.emotes) {
                const start = emote.char_range.start;
                const end = emote.char_range.end;

                const wordToReplace = msg.slice(start, end);
                const emoteURL = TwitchEmotes.parseEmoteUrl(emote);

                wordEmoteMap[wordToReplace] = {
                    name: wordToReplace,
                    url: emoteURL,
                };
            }
        }

        if (message.tags['msg-id'] == "highlighted-message") {
            this.setAttribute('highlighted', '');
        }

        msg.split(" ").forEach(str => {
            // channel emote repalcement
            if (str in this.chat.channel_emotes) {
                wordEmoteMap[str] = {
                    name: str,
                    url: this.chat.channel_emotes[str],
                };
            }
            // global emotes repalcement
            if (str in Emotes.global_emotes) {
                wordEmoteMap[str] = {
                    name: str,
                    url: Emotes.global_emotes[str],
                };
            }
            // url repalcement
            const urlMatch = Webbrowser.matchURL(str);
            if (urlMatch) {
                wordLinkMap[urlMatch[0]] = urlMatch[0];
            }
            // mention repalcement
            if (str.match(/\@[a-zA-Z0-9]+/g)) {
                wordMentionMap[str] = str;
            }
            // highlight mentions
            const client_user = getLoggedInUsername().toLocaleLowerCase();
            if (client_user != "" && str.toLocaleLowerCase().match(client_user)) {
                wordMentionMap[str] = str;
                this.setAttribute('tagged', '');

                // is current user => send to mentions chat
                //   yeah not the ideal palce to do this... should process and parse messages elswhere
                if (this.chat.roomName !== "Mentions") {
                    const mentionChat = Application.getChats("@");
                    if (!mentionChat.querySelector(`[messageid="${message.id}"]`)) {
                        mentionChat.appendMessage(message, this.chat);
                    }
                }
            }
        });

        const msg_split = msg.split(" ");
        let parsed_msg = msg_split.map(word => {
            // replace emotes
            if (wordEmoteMap[word]) {
                return html`<img class="emote" name="${wordEmoteMap[word].name}" alt="${word}" src="${wordEmoteMap[word].url}" height="32"> `;
            }
            // replace links
            if (wordLinkMap[word]) {
                return html`<a class="inline-link" href="javascript:()" @click="${() => {
                    Webbrowser.openURL(wordLinkMap[word]);
                }}">${wordLinkMap[word]}</a> `;
            }
            // replace mentions
            if (wordMentionMap[word]) {
                return html`<span class="mention">${word}</span> `;
            }
            return word + " ";
        });

        return html`
            <div class="line" style="--color: ${message.color}" ?action="${message.is_action}">
                <span class="bages">
                    ${message.badges.map(badge => {
            let badge_url = "";

            if (badge.name == "subscriber") {
                badge_url = this.chat.getSubBadge(badge.version) || Badges.getBadgeByName(badge.name, badge.version);
            } else {
                badge_url = Badges.getBadgeByName(badge.name, badge.version);
            }

            return html`<img class="badge" alt="${badge.name}" src="${badge_url}" width="18" height="18">`;
        })}
                </span>
                <span class="username">${message.user_name}:</span>
                ${isReply ? html`
                    <button class="reply-icon" title="Open Thread" @click="${this.openThread}">
                        <img src="./images/question_answer_white_24dp.svg" height="18px" width="18px" />
                    </button>
                ` : ""}
                <span class="message">${parsed_msg}</span>
                
                <div class="tools">
                    ${this.chat.roomName === "Mentions" ? html`
                        <div class="chat-line-tool" @click="${() => this.jumpToChat()}" title="Jump to chat">
                            <img src="./images/navigate_before_white_24dp.svg" width="18px" height="18px" />
                        </div>
                    ` : ""}
                    ${message.user_name !== getLoggedInUsername() ? html`
                        <div class="chat-line-tool" title="Reply" @click="${() => this.reply()}">
                            <img src="./images/reply_white_24dp.svg" height="18px" width="18px" />
                        </div>
                        <div class="chat-line-tool mod-tool" @click="${() => this.timeout(10)}">
                            <img src="./images/block_white_24dp.svg" width="18px" height="18px" />
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
    }

}

