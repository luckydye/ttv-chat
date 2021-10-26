import { css, html, LitElement } from 'lit-element';
import { ChatMessage } from '../services/IRCChatClient';
import Badges from '../services/Badges';
import { getUserInfo } from '../services/Twitch';
import Emotes from '../services/Emotes';

Emotes;

export default class TwitchChat extends LitElement {

    MAX_BUFFER_SIZE = 1000;

    scrollTarget = 0;
    scrollLock = true;

    roomName: string = "";

    appendMessage(msg: ChatMessage) {
        const line = new ChatLine(this, msg);
        this.appendChild(line);
    }

    appenLine(text: string) {
        const line = new ChatInfo(text);
        this.appendChild(line);
    }

    setRoom(roomName: string) {
        this.roomName = roomName;

        getUserInfo(this.roomName).then(async info => {
            this.info = info;

            const badges = await Badges.getChannelBadges(info.id);
            this.channel_badges = badges;

            const emotes = await Emotes.getChannelEmotes(info.id);
            this.channel_emotes = emotes;
        })

        this.update();
    }

    getSubBadge(version: number) {
        return this.channel_badges["subscriber"].versions[version].image_url_2x;
    }

    constructor() {
        super();

        this.info = {};
        this.channel_badges = {};
        this.channel_emotes = {};

        window.addEventListener('wheel', e => {
            if (e.deltaY < 0) {
                this.scrollLock = false;
            }
        })

        const update = () => {

            const latest = this.scrollHeight - this.clientHeight;
            // if(this.scrollTarget >= latest - 10) {
            //     this.scrollLock = true;
            // } 
            
            if(this.scrollTarget - 10 <= latest) {
                this.scrollLock = true;
            }

            // update scroll position
            if (this.scrollLock) {
                this.scrollTarget = latest;
                this.scrollTo(0, this.scrollTarget);
            }

            // clean out buffer
            if (this.children.length > this.MAX_BUFFER_SIZE && this.scrollLock === true) {
                const rest = (this.children.length - this.MAX_BUFFER_SIZE);
                for(let i = 0; i < rest; i++) {
                    this.children[i].remove();
                }
            }

            requestAnimationFrame(update);
        }

        update();
    }

    static get styles() {
        return css`
            :host {
                display: block;
                max-height: 85vh;
                width: 100%;
                overflow: auto;
                overflow-y: scroll;
            }
            .lines {
                
            }
            .line {

            }
        `;
    }

    render() {
        return html`
            <div>Room: ${this.roomName}</div>
            <div class="lines">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('twitch-chat', TwitchChat);

class ChatLine extends LitElement {

    message: ChatMessage | null = null;
    chat: TwitchChat | null = null;

    constructor(chat: TwitchChat, msg: ChatMessage) {
        super();

        this.chat = chat;
        this.message = msg;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                margin-top: 8px;
            }
            .username {
                color: var(--color);
                display: inline;
            }
            .message {
                display: inline;
            }
            .badge {
                display: inline-block;
                margin-bottom: -0.2em;
                margin-right: 3px;
            }
            .emote {
                display: inline-block;
                margin-bottom: -0.2em;
                margin-right: 3px;
            }
        `;
    }

    render() {
        if(this.message) {
            const msg = this.message.message;
            const parsed_msg = msg.split(" ").map(str => {
                if(str in this.chat.channel_emotes) {
                    return html`<img class="emote" src="${this.chat.channel_emotes[str]}" height="32">`;
                }
                if(str in Emotes.global_emotes) {
                    return html`<img class="emote" src="${Emotes.global_emotes[str]}" height="32">`;
                }
                return str + " ";
            });

            return html`
                <div class="line">
                    <span class="bages">
                        ${this.message.badges.map(badge => {
                            let badge_url = "";

                            if(badge.name == "subscriber") {
                                badge_url = this.chat.getSubBadge(badge.version);
                            } else {
                                badge_url = Badges.getBadgeByName(badge.name, badge.version);
                            }

                            return html`<img class="badge" src="${badge_url}" width="18" height="18">`;
                        })}
                    </span>
                    <span class="username" style="--color: ${this.message.color}">${this.message.username}</span>:
                    <span class="message">${parsed_msg}</span>
                </div>
            `;
        }
    }

}

customElements.define('chat-line', ChatLine);

class ChatInfo extends LitElement {

    message: string = "";

    constructor(msg: string) {
        super();

        this.message = msg;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .message {
                display: inline;
            }
        `;
    }

    render() {
        if(this.message) {
            return html`
                <div class="line">
                    <div class="message">${this.message}</div>
                </div>
            `;
        }
    }

}

customElements.define('chat-info', ChatInfo);