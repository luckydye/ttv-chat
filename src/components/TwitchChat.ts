import { css, html } from 'lit-element';
import Application from '../App';
import Webbrowser from '../Webbrowser';
import Chat from './Chat';
import ContextMenu from './ContextMenu';
import Format from '../Format';
import Events, { on } from '../events/Events';
// Components
import './FluidInput';
import './Timer';
import './UserList';

export default class TwitchChat extends Chat {

    channel: string | undefined;

    stream_title: any;

    bio: any;

    static get styles() {
        return css`
            ${super.styles}

            .info {
                opacity: 0.5;
                padding: 10px 15px;
            }

            .header {
                background: rgba(25, 25, 28, 0.75);
                backdrop-filter: blur(24px);
                background: rgba(25, 25, 28, 0.9);
                backdrop-filter: blur(24px);
                position: relative;
                z-index: 1000;
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

            .chat-state-icons {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                grid-column: 3;
            }
            .user-state-icon,
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
                padding: 0px 3px;
            }
            .room-state-icon.action-expand {
                padding: 0px;
            }
            .user-state-icon[active],
            .room-state-icon[active] {
                display: flex;
            }
            :host([modview]) .room-state-icon {
                opacity: 0.25;
                display: flex;
            }
            :host([modview]) .room-state-icon[active] {
                opacity: 1;
            }

            :host([modview]) .room-state-icon {
                border: none;
                margin: 0px;
                background: transparent;
                min-width: 16px;
                height: 22px;
                cursor: pointer;
                border-radius: 3px;
            }
            :host([modview]) .room-state-icon:hover {
                outline: #464646 solid 1px;
            }
            :host([modview]) .room-state-icon:active {
                background: #333333;
            }
            :host([modview]) .room-state-icon:active img {
                transform: scale(0.95);
            }

            .user-list-preview:focus-within,
            .user-list-preview:hover,
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

            .event-feed {
                position: absolute;
                top: 60px;
                left: 10px;
                /* outline: 1px solid white; */
                right: 10px;
                height: 40px;
                z-index: 1000;
                pointer-events: none;
            }
        `;
    }

    async openUserlist() {
        const listEle = this.shadowRoot.querySelector('chat-user-list');
        listEle.updateList();
    }

    openSlowModeSettins(e) {
        const channel = Application.getChannel(this.channel);
        const menu = ContextMenu.openOn(e.target, 'down');
        const input = document.createElement('fluid-input');
        input.value = channel?.slowmode_time;
        input.steps = "1";
        input.min = 1;
        input.max = 600;
        input.suffix = "sec";
        input.style.width = "100px";
        input.addEventListener('change', e => {
            channel.slowmode_time = input.value;
        })
        menu.append(input);
    }

    openFollowerModeSettings(e) {
        const channel = Application.getChannel(this.channel);
        const menu = ContextMenu.openOn(e.target, 'down');
        const input = document.createElement('fluid-input');
        input.value = channel.followermode_time;
        input.steps = "1";
        input.min = 1;
        input.max = 600;
        input.suffix = "min";
        input.style.width = "100px";
        input.addEventListener('change', e => {
            channel.followermode_time = input.value;
        })
        menu.append(input);
    }

    setRoom(channel_login: string) {
        this.channel = channel_login;
    }

    setTitle({
        viewer_count = 0,
        started_at = 0,
        game_name = "",
        title = ""
    } = {}) {
        this.stream_title = html`
            <div title="${title}">
                ${Format.number(viewer_count)} - <stream-timer starttime="${started_at}"></stream-timer> - ${game_name} - ${title}
            </div>
        `;
    }

    setBio(bio_data: any) {
        this.bio = bio_data;
        this.update();
    }
    
    constructor() {
        super();

        on(Events.ChannelInfoChanged, async e => {
            const channel = e.data.channel;
            if(channel.channel_login === this.channel) {
                this.update();
            }
        });

        on(Events.ChannelStateChanged, async e => {
            const channel = e.data.channel;
            if(channel.channel_login === this.channel) {
                this.update();

                if(channel.moderator || channel.broadcaster) {
                    this.setAttribute('modview', '');
                } else {
                    this.removeAttribute('modview');
                }
            }

        });
    }

    render() {
        if (!this.channel) {
            return html``;
        }
        const channel = Application.getChannel(this.channel);

        if (!channel) {
            return html``;
        }

        return html`
            <div class="header">
                <div class="chat-actions">
                    <div>
                        <div class="chat-action">
                            <button title="Close chat" @click="${(e) => {
                                Application.removeChannel(channel.channel_login);
                            }}">
                                <img src="./images/close.svg" width="16px" height="16px" />
                            </button>
                        </div>
                        <div class="chat-action">
                            <button class="user-list-button" title="Userlist" @click="${() => {
                                this.openUserlist();
                            }}">    
                                <img src="./images/people.svg" width="16px" height="16px" />
                            </button>
                            <div class="user-list-preview" tabindex="0">
                                <chat-user-list channel="${channel.channel_login}"></chat-user-list>
                            </div>
                        </div>
                        <div class="chat-action">
                            <button title="Open Stream" @click="${() => {
                                Webbrowser.openInBrowwser(`https://www.twitch.tv/${channel.channel_login}`);
                            }}">
                                <img src="./images/open.svg" width="16px" height="16px" />
                            </button>
                        </div>
                    </div>
                    <div class="chat-channel-name" @click="${() => {
                        Webbrowser.openInBrowwser(`https://www.twitch.tv/${channel.channel_login}`);
                    }}">
                        ${channel.channel_login}
                    </div>
                    <div class="chat-state-icons">
                        <div class="chat-action">
                            <div class="room-state-icon" title="Slow mode for ${channel.slow_mode}s" ?active="${channel.slow_mode !== 0}" @click="${channel.toggleSlowMode.bind(channel)}">
                                <img src="./images/slowmode.svg" width="18px" height="18px"/>
                            </div>
                            <div class="room-state-icon action-expand" title="Slowmode time" @click="${this.openSlowModeSettins}">
                                <img src="./images/expand_more_black_24dp.svg" width="16px" height="16px"/>
                            </div>
                        </div>
                        <div class="chat-action">
                            <div class="room-state-icon" title="Follow mode for ${channel.follwers_only}s" ?active="${channel.follwers_only !== 0}" @click="${channel.toggleFollowerMode.bind(channel)}">
                                <img src="./images/follower.svg" width="18px" height="18px"/>
                            </div>
                            <div class="room-state-icon action-expand" title="Follower time" @click="${this.openFollowerModeSettings}">
                                <img src="./images/expand_more_black_24dp.svg" width="16px" height="16px"/>
                            </div>
                        </div>
                        <div class="chat-action">
                            <div class="room-state-icon" title="Emote only mode" ?active="${channel.emote_only}" @click="${channel.toggleEmoteOnlyMode.bind(channel)}">
                                <img src="./images/emote.svg" width="18px" height="18px"/>
                            </div>
                        </div>
                        <div class="chat-action">
                            <div class="room-state-icon" title="Sub only mode" ?active="${channel.subscribers_only}" @click="${channel.toggleSubOnlyMode.bind(channel)}">
                                <img src="./images/subscriber.svg" width="18px" height="18px"/>
                            </div>
                        </div>
                        <div class="chat-action">
                            <div class="room-state-icon" title="r9k mode" ?active="${channel.r9k}" @click="${channel.toggleR9kMode.bind(channel)}">r9k</div>
                        </div>
                        <div class="chat-action">
                            <div class="user-state-icon" title="Moderator" ?active="${channel.moderator}">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2" width="18px" height="18px"/>
                            </div>
                        </div>
                        <div class="chat-action">
                            <div class="user-state-icon" title="Broadcaster" ?active="${channel.broadcaster}">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2" width="18px" height="18px"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-title">
                    ${!this.stream_title ?
                        (channel.chatter_count > 0 ? `Offline - ${Format.number(channel.chatter_count)} chatters` : "Offline")
                    : this.stream_title}
                </div>
            </div>
            <div class="event-feed">
                
            </div>
            <div class="scroll-to-bottom" @click="${() => this.lock()}">
                <span>Scroll to the bottom</span>
            </div>
            <div class="lines">
                ${this.bio ? html`
                    <div class="bio">
                        <div class="profile-image">
                            <img src="${channel.profile_image_url || ''}" width="125px" />
                        </div>
                        <div class="pin">
                            <div class="profile-name">
                                ${this.bio.broadcaster_name}
                                ${this.bio.broadcaster_type == "partner" ? html`
                                    <img src="./images/verified.svg" alt="verified"/>
                                ` : ""}
                            </div>
                            <div class="game">
                                ${this.bio.game_name}
                            </div>
                            <div class="language">
                                ${Format.lang(this.bio.broadcaster_language)}
                            </div>
                            <div class="viewcount">
                                ${Format.number(channel.channel_view_count)} views
                            </div>
                        </div>
                        ${channel.channel_description == "" ? "" : html`
                            <div class="profile-desc">
                                ${channel.channel_description}
                            </div>
                        `}
                    </div>
                ` : ""}
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('twitch-chat', TwitchChat);
