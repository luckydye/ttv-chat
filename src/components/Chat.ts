import { css, html, LitElement } from 'lit-element';
import { ChatMessage } from '../services/IRCChatClient';
import Badges from '../services/Badges';
import { getUserInfo } from '../services/Twitch';
import Emotes from '../services/Emotes';
import TwitchAPI from '../services/Twitch';
import Webbrowser from '../services/Webbrowser';

export default class TwitchChat extends LitElement {

    MAX_BUFFER_SIZE = 1000;

    scrollLock = true;

    roomName: string = "";
    stream_title: string = "";

    info = {};
    channel_badges = {};
    channel_emotes = {};

    appendMessage(msg: ChatMessage) {
        const line = new ChatLine(this, msg);
        this.appendChild(line);
        setTimeout(() => {
            this.afterAppend();
        }, 1)
    }

    appenLine(text: string) {
        const line = new ChatInfo(text);
        this.appendChild(line);
        setTimeout(() => {
            this.afterAppend();
        }, 1);
    }

    lock() {
        this.scrollLock = true;
        this.setAttribute('locked', '');
        this.scrollToLatest();
    }

    unlock() {
        this.scrollLock = false;
        this.removeAttribute('locked');
    }

    scrollToLatest() {
        const scrollEle = this.shadowRoot?.querySelector('.lines');
        if(!scrollEle) return;

        const latest = (scrollEle.scrollHeight - scrollEle.clientHeight);
        if (this.scrollLock) {
            scrollEle.scrollTo(0, latest + 100);
        }
    }

    afterAppend() {
        const scrollEle = this.shadowRoot?.querySelector('.lines');
        if(!scrollEle) return;

        const latest = (scrollEle.scrollHeight - scrollEle.clientHeight);

        if(scrollEle.scrollTop >= latest - 50) {
            this.lock();
        } 
        if(scrollEle.scrollTop < latest - 1000) {
            this.unlock();
        }

        // update scroll position
        this.scrollToLatest();

        // clean out buffer
        if (this.children.length > this.MAX_BUFFER_SIZE) {
            const rest = (this.children.length - this.MAX_BUFFER_SIZE);
            for (let i = 0; i < rest; i++) {
                this.children[i].remove();
            }
        }
    }

    setRoom(roomName: string) {
        this.roomName = roomName;

        getUserInfo(this.roomName).then(async info => {
            this.info = info;

            const stream = await TwitchAPI.getStreams(info.id);
            if(stream[0]) {

                const viewers = stream[0].viewer_count;
                const uptimems = Date.now() - new Date(stream[0].started_at).valueOf();
                const uptime = {
                    hours: Math.floor(uptimems / 1000 / 60 / 60),
                    minutes: Math.floor((uptimems / 1000 / 60) % 60),
                    seconds: Math.floor((uptimems / 1000) % 60),
                }
                const uptimestring = `${uptime.hours}h${uptime.minutes}m${uptime.seconds}s`;

                this.stream_title = viewers + " - " + uptimestring + " - " + stream[0].game_name  + " - " + stream[0].title;

                this.update();
            }

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

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.scrollToLatest();
        }, 10);
    }

    constructor() {
        super();

        this.addEventListener('wheel', e => {
            if (e.deltaY < 0) {
                this.unlock();
            }
        })
    }

    static get styles() {
        return css`
            :host {
                display: block;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .lines {
                margin-top: 30px;
                padding-bottom: 10px;
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: calc(100% - 30px);
                overflow: auto;
                overflow-y: scroll;
                overflow-x: hidden;
            }
            .line {

            }
            .info {
                opacity: 0.5;
                padding: 10px 15px;
            }

            .chat-title {
                position: relative;
                z-index: 1000;
                width: 100%;
                background: rgb(25, 25, 28);
                padding: 5px 10px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                align-items: center;
                white-space: nowrap;
                font-size: 12px;
                color: #ababab;
                border-bottom: 1px solid black;
            }

            .chat-title:hover {
                cursor: pointer;
                background: rgb(33, 33, 36);
            }
            .chat-title:active {
                background: rgb(25, 25, 28);
            }

            .chat-title span {
                opacity: 0.5;
            }

            :host(:not([locked])) .scroll-to-bottom {
                display: block;
            }

            .scroll-to-bottom {
                display: none;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background: #080808;
                padding: 8px 15px;
                text-align: center;
                box-sizing: border-box;
                z-index: 100000;
                opacity: 0.9;
                cursor: pointer;
            }
            .scroll-to-bottom:hover {
                opacity: 0.95;
            }
            .scroll-to-bottom:active {
                opacity: 1;
            }

            /* // webkit scrollbars */
            ::-webkit-scrollbar {
                width: 8px;
                margin: 5px 0;
            }
            ::-webkit-scrollbar-button {
                display: none;
            }
            ::-webkit-scrollbar-track-piece  {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: var(--color-scrollbar-thumb, #1c1c1c);
                border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--color-scrollbar-thumb-hover, #333333);
            }
            ::-webkit-scrollbar-corner {
                background: transparent;
            }
        `;
    }

    render() {
        return html`
            <div class="chat-title" @click="${() => {
                Webbrowser.openURL(`https://www.twitch.tv/${this.roomName}`);
            }}">
                ${this.stream_title == "" ? "Offline" : this.stream_title}
            </div>
            <div class="scroll-to-bottom" @click="${() => this.lock()}">
                <span>Scroll to bottom</span>
            </div>
            <div class="lines">
                ${this.roomName ? html`
                    <div class="info">Connected to ${this.roomName}</div>
                `: ""}
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
                padding: 5px 15px;
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
        if (this.message) {
            const msg = this.message.message;
            const parsed_msg = msg.split(" ").map(str => {
                if (str in this.chat.channel_emotes) {
                    return html`<img class="emote" src="${this.chat.channel_emotes[str]}" height="32">`;
                }
                if (str in Emotes.global_emotes) {
                    return html`<img class="emote" src="${Emotes.global_emotes[str]}" height="32">`;
                }
                return str + " ";
            });

            return html`
                <div class="line">
                    <span class="bages">
                        ${this.message.badges.map(badge => {
                let badge_url = "";

                if (badge.name == "subscriber") {
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
                background: #211b25;
                padding: 5px 15px;
                margin: 2px 0;
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

customElements.define('chat-info', ChatInfo);
