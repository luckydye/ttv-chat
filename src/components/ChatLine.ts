import { css, html, LitElement } from 'lit-element';
import { ChatMessage } from '../services/IRCChatClient';
import Badges from '../services/Badges';
import { getLoggedInUsername } from '../services/Twitch';
import Emotes from '../services/Emotes';
import Webbrowser from '../services/Webbrowser';
import TwitchEmotes from '../services/emotes/TwitchEmotes';

export class ChatLine extends LitElement {

    message: ChatMessage | null = null;
    chat: TwitchChat | null = null;

    constructor(chat: TwitchChat, msg: ChatMessage) {
        super();

        this.chat = chat;
        this.message = msg;
    }

    connectedCallback() {
        super.connectedCallback();

        this.setAttribute('messageid', this.message.id);
        this.setAttribute('userid', this.message.sender_id);
    }

    // static get styles() {
    //     return css`
    //         :host {
    //             display: block;
    //             padding: 5px 15px;
    //             line-height: 1.33em;
    //         }
    //         :host([deleted]) {
    //             opacity: 0.33;
    //         }
    //         :host([highlighted]) {
    //             background: rgb(255 0 0 / 22%);
    //         }
    //     `;
    // }

    createRenderRoot() {
        return this;
    }

    render() {
        if (this.message) {
            const msg = this.message.message;

            const wordEmoteMap = {};
            const wordLinkMap = {};
            const wordMentionMap = {};

            if (this.message.emotes) {
                for (let emote of this.message.emotes) {
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
                    this.setAttribute('highlighted', '');
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
                <div class="line" style="--color: ${this.message.color}" ?action="${this.message.is_action}">
                    <span class="bages">
                        ${this.message.badges.map(badge => {
                let badge_url = "";

                if (badge.name == "subscriber") {
                    badge_url = this.chat.getSubBadge(badge.version) || Badges.getBadgeByName(badge.name, badge.version);
                } else {
                    badge_url = Badges.getBadgeByName(badge.name, badge.version);
                }

                return html`<img class="badge" alt="${badge.name}" src="${badge_url}" width="18" height="18">`;
            })}
                    </span>
                    <span class="username">${this.message.username}:</span>
                    <span class="message">${parsed_msg}</span>
                </div>
            `;
        }
    }

}


export class ChatInfo extends LitElement {

    message: string = "";

    constructor(msg: string) {
        super();

        this.message = msg;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                background: #211b25;
                padding: 8px 15px;
                margin: 2px 0;
                line-height: 1.33em;
            }
            .message {
                display: inline;
            }
        `;
    }

    render() {
        if (this.message) {
            return html`
                <div class="line">
                    <div class="message">${this.message}</div>
                </div>
            `;
        }
    }

}

export class ChatNote extends LitElement {

    message: string = "";

    constructor(msg: string) {
        super();

        this.message = msg;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                background: #0c0c0c;
                padding: 8px 15px;
                margin: 2px 0;
                opacity: 0.5;
                line-height: 1.33em;
            }
            .message {
                display: inline;
            }
        `;
    }

    render() {
        if (this.message) {
            return html`
                <div class="line">
                    <div class="message">${this.message}</div>
                </div>
            `;
        }
    }

}


customElements.define('chat-line', ChatLine);
customElements.define('chat-info', ChatInfo);
customElements.define('chat-note', ChatNote);
