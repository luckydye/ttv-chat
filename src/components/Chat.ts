import { css, html, LitElement } from 'lit-element';
import IRCChatClient, { ChatMessage } from '../services/IRCChatClient';
import Badges from '../services/Badges';
import { getUserInfo } from '../services/Twitch';
import Emotes from '../services/Emotes';
import TwitchAPI from '../services/Twitch';
import Webbrowser from '../services/Webbrowser';
import { ChatLine, ChatInfo, ChatNote } from './ChatLine';
import { Application } from '../App';
import { formatLang, formatNumber } from '../utils';
// Components
import './Timer';
import './UserList';

export default class TwitchChat extends LitElement {

    MAX_BUFFER_SIZE = 500;

    scrollLock = true;

    roomName: string = "";
    stream_title: string = "";

    info = null;
    channel_badges: {
        [key: string]: any;
    } = {};
    
    channel_emotes = {};

    r9k = false;
    subscribers_only = false;
    emote_only = false;
    follwers_only = 0;
    slow_mode = 0;
    
    moderator = false;
    broadcaster = false;

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

    appenNote(text: string) {
        const line = new ChatNote(text);
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

        if(scrollEle.scrollHeight > 0) {
            const latest = (scrollEle.scrollHeight - scrollEle.clientHeight);
            if (this.scrollLock) {
                scrollEle.scrollTo(0, latest + 100);
            }
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

        const updateStatus = async () => {
            const stream = await TwitchAPI.getStreams(this.info.id);
            if(stream[0]) {

                const {
                    viewer_count,
                    started_at,
                    game_name,
                    title
                } = stream[0];

                this.stream_title = html`
                    <div title="${title}">
                        ${formatNumber(viewer_count)} - <stream-timer starttime="${started_at}"></stream-timer> - ${game_name} - ${title}
                    </div>
                `;

                this.update();
            }
        }

        setInterval(() => {
            updateStatus();
        }, 1000 * 15);

        getUserInfo(this.roomName).then(async info => {
            this.info = info;

            updateStatus();

            const channel = await TwitchAPI.getChannel(info.id);
            info.channel_info = channel[0];

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
        });

        IRCChatClient.listen('chat.user', msg => {
            if(msg.channel === this.roomName) {
                this.moderator = msg.badges.find(b => b.name == "moderator") !== undefined;
                this.broadcaster = msg.badges.find(b => b.name == "broadcaster") !== undefined;
                this.update();
            }
        })

        IRCChatClient.listen('chat.state', msg => {
            if(msg.channel_login == this.roomName) {
                if(msg.r9k !== null) {
                    this.r9k = msg.r9k;
                }
                if(msg.subscribers_only !== null) {
                    this.subscribers_only = msg.subscribers_only;
                }
                if(msg.emote_only !== null) {
                    this.emote_only = msg.emote_only;
                }
                if(msg.follwers_only !== null) {
                    this.follwers_only = msg.follwers_only !== "Disabled" ? msg.follwers_only.Enabled.secs : 0;
                }
                if(msg.slow_mode !== null) {
                    this.slow_mode = msg.slow_mode.secs;
                }
                this.update();
            }
        });
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
                margin-top: 54px;
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: calc(100% - 54px);
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
                z-index: 100;
                width: 100%;
                background: rgb(25, 25, 28);
                padding: 5px 10px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                align-items: center;
                white-space: nowrap;
                font-size: 12px;
                font-weight: 400;
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
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                padding: 4px 8px;
                box-sizing: border-box;
                z-index: 1000;
            }

            .chat-action {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }

            .chat-actions button {
                border: none;
                padding: 0px;
                margin: 0px;
                background: transparent;
                min-width: 24px;
                height: 22px;
                cursor: pointer;
            }
            .chat-actions button:hover {
                outline: #464646 solid 1px;
            }
            .chat-actions button:active {
                background: #333333;
            }
            .chat-actions button:active img {
                transform: scale(0.95);
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

            @keyframes bio-slidein {
                from { transform: translate(0, -0px); opacity: 0; }
            }
            .bio {
                animation: bio-slidein .2s ease;
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
            .profile-image img {
                width: 100%;
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
                line-height: 150%;
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

            .chat-state-icons {
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .room-state-icon {
                display: none;
                color: #eee;
                opacity: 0.5;
                margin-left: 5px;
                cursor: default;
                justify-content: center;
                align-items: center;
                margin-left: 8px;
                user-select: none;
            }
            .room-state-icon[active] {
                display: flex;
            }

            .user-list-preview:focus,
            .user-list-button:focus ~ .user-list-preview {
                display: block;
            }

            .user-list-preview {
                position: absolute;
                top: calc(100% + 5px);
                left: -10px;
                display: none;
            }

            .expand-list {
                display: inline-block;
                margin-left: 8px;
            }

            .chat-channel-name {
                opacity: 0.75;
                font-size: 12px;
                font-weight: 400;
            }
        `;
    }

    async openUserlist() {
        const listEle = this.shadowRoot.querySelector('chat-user-list');
        listEle.updateList();
    }

    render() {
        return html`
            <div class="chat-actions">
                <div>
                    <div class="chat-action">
                        <button title="Close chat" @click="${(e) => {
                            Application.closeRoom(this.roomName);
                        }}">
                            <img src="./close.svg" width="16px" height="16px" />
                        </button>
                    </div>
                    <div class="chat-action">
                        <button class="user-list-button" title="Userlist" @click="${() => {
                            this.openUserlist();
                        }}">
                            <img src="./people.svg" width="16px" height="16px" />
                        </button>
                        <div class="user-list-preview" tabindex="0">
                            <chat-user-list channel="${this.roomName}"></chat-user-list>
                        </div>
                    </div>
                    <div class="chat-action">
                        <button title="Open Stream" @click="${() => {
                            Webbrowser.openURL(`https://www.twitch.tv/${this.roomName}`);
                        }}">
                            <img src="./open.svg" width="16px" height="16px" />
                        </button>
                    </div>
                </div>
                <div class="chat-channel-name">
                    ${this.roomName}
                </div>
                <div class="chat-state-icons">
                    <div class="chat-action">
                        <div class="room-state-icon" title="Slow mode for ${this.slow_mode}s" ?active="${this.slow_mode !== 0}">
                            <img src="./slowmode.svg" width="18px" height="18px"/>
                        </div>
                    </div>
                    <div class="chat-action">
                        <div class="room-state-icon" title="Follow mode for ${this.follwers_only}s" ?active="${this.follwers_only !== 0}">
                            <img src="./follower.svg" width="18px" height="18px"/>
                        </div>
                    </div>
                    <div class="chat-action">
                        <div class="room-state-icon" title="Emote only mode" ?active="${this.emote_only}">
                            <img src="./emote.svg" width="18px" height="18px"/>
                        </div>
                    </div>
                    <div class="chat-action">
                        <div class="room-state-icon" title="Sub only mode" ?active="${this.subscribers_only}">
                            <img src="./subscriber.svg" width="18px" height="18px"/>
                        </div>
                    </div>
                    <div class="chat-action">
                        <div class="room-state-icon" title="r9k mode" ?active="${this.r9k}">r9k</div>
                    </div>
                    <div class="chat-action">
                        <div class="room-state-icon" title="Moderator" ?active="${this.moderator}">
                            <img src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2" width="18px" height="18px"/>
                        </div>
                    </div>
                    <div class="chat-action">
                        <div class="room-state-icon" title="Broadcaster" ?active="${this.broadcaster}">
                            <img src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2" width="18px" height="18px"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-title" @click="${() => {
                Webbrowser.openURL(`https://www.twitch.tv/${this.roomName}`);
            }}">
                ${this.stream_title == "" ? "Offline" : this.stream_title}
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
                            ${this.info.description == "" ? "" : html`
                                <div class="profile-desc">
                                    ${this.info.description}
                                </div>
                            `}
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
