import { css, html, LitElement } from 'lit-element';
import { ChatMessage } from '../services/IRCChatClient';
import Badges from '../services/Badges';
import { getUserInfo } from '../services/Twitch';
import Emotes from '../services/Emotes';
import TwitchAPI from '../services/Twitch';
import Webbrowser from '../services/Webbrowser';
import { ChatLine, ChatInfo } from './ChatLine';
import { Application } from '../App';

const NumberFormat = new Intl.NumberFormat('en-IN');
const langFormat = new Intl.DisplayNames(['en'], { type: 'language' });

const formatLang = (langshort: string) => langFormat.of(langshort);
const formatNumber = (n: number) => NumberFormat.format(n);

export default class TwitchChat extends LitElement {

    MAX_BUFFER_SIZE = 1000;

    scrollLock = true;

    roomName: string = "";
    stream_title: string = "";

    info = null;
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

        if(scrollEle.scrollTop >= latest - 10) {
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

            const channel = await TwitchAPI.getChannel(info.id);
            info.channel_info = channel[0];
            
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

            this.update();
        })

        this.update();
    }

    getSubBadge(version: number) {
        if(this.channel_badges["subscriber"]) {
            return this.channel_badges["subscriber"].versions[version].image_url_2x;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.scrollToLatest();
            this.afterAppend();
        }, 10);
    }

    constructor() {
        super();

        this.addEventListener('wheel', e => {
            if (e.deltaY < 0) {
                this.unlock();
            }
            this.afterAppend();
        })

        // update room info at interval
        const update_info = () => getUserInfo(this.roomName).then(info => {
            this.setRoom(this.roomName);
            setTimeout(() => update_info(), 1000 * 60);
        });
        window.addEventListener('loggedin', e => {
            update_info();
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
                margin-top: 58px;
                padding-bottom: 10px;
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: calc(100% - 58px);
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

            .chat-actions {
                width: 100%;
                background: rgb(25 25 28);
                position: relative;
                z-index: 1000;
                display: flex;
                justify-content: space-between;
                padding: 4px 8px;
                box-sizing: border-box;
            }

            .chat-actions button {
                border: none;
                padding: 4px;
                line-height: 100%;
                margin: 0;
                background: rgb(102, 102, 107);
                min-width: 24px;
                cursor: pointer;
            }

            .chat-actions button:hover {
                background: rgb(110, 110, 114);
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

            .bio {
                display: grid;
                grid-template-columns: auto 1fr;
                padding: 30px 30px 40px 30px;
                margin-bottom: 10px;
                background: #0c0c0c;
            }
            .profile-image {
                border-radius: 50%;
                overflow: hidden;
                width: 112px;
                height: 112px;
                border: 3px solid rgb(148, 74, 255);
            }
            .pin {
                margin-left: 30px;
            }
            .profile-name {
                font-size: 28px;
                margin-bottom: 5px;
                white-space: nowrap;
            }
            .profile-desc {
                margin-top: 20px;
                grid-column: 1 / span 2;
            }
            .viewcount {
                opacity: 0.5;
                margin-bottom: 5px;
            }
            .game {
                opacity: 0.5;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .language {
                opacity: 0.5;
                margin-bottom: 5px;
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
            <div class="chat-actions">
                <div>
                    <button title="Close chat" @click="${(e) => {
                        Application.closeRoom(this.roomName);
                    }}">x</button>
                </div>
                <div>
                    <button title="Follower Mode">o</button>
                    <button title="Sub mode">y</button>
                    <button title="Open Stream" @click="${() => {
                        Webbrowser.openURL(`https://www.twitch.tv/${this.roomName}`);
                    }}">y</button>
                </div>
            </div>
            <div class="scroll-to-bottom" @click="${() => this.lock()}">
                <span>Scroll to the bottom</span>
            </div>
            <div class="lines">
                ${this.roomName ? html`
                    ${this.info ? html`
                        <div class="bio">
                            <div class="profile-image">
                                <img src="${this.info.profile_image_url}" width="125px" />
                            </div>
                            <div class="pin">
                                <div class="profile-name">
                                    ${this.info.display_name}
                                    ${this.info.broadcaster_type == "partner" ? html`
                                        <img src="./verified.svg" alt="verified"/>
                                    ` : ""}
                                </div>
                                <div class="game">
                                    ${this.info.channel_info.game_name}
                                </div>
                                <div class="language">
                                    ${formatLang(this.info.channel_info.broadcaster_language)}
                                </div>
                                <div class="viewcount">
                                    ${formatNumber(this.info.view_count)} views
                                </div>
                            </div>
                            <div class="profile-desc">
                                ${this.info.description}
                            </div>
                        </div>
                    ` : ""}
                    <div class="info">Connected to ${this.roomName}</div>
                `: ""}
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('twitch-chat', TwitchChat);
