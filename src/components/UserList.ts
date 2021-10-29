// http://tmi.twitch.tv/group/user/{{username}}/chatters

import { css, html, LitElement } from 'lit-element';
import IRCChatClient from '../services/IRCChatClient';
import { formatNumber } from '../utils';

export default class ChatUserList extends LitElement {

    static get properties() {
        return {
            channel: String,
        };
    }

    channel: string;
    list: Array<any>;

    updateList() {
        this.request();
    }

    async request() {
        // TODO: I should reate limit this request, since its not gonna change every minute anyway
        const list = await IRCChatClient.getUserlist(this.channel);
        this.list = list.chatters;

        const chatters = list.chatters;

        const viewerCount = chatters.viewers.length;
        const modCount = chatters.moderators.length;
        const vipCount = chatters.vips.length;
        const staffCount = chatters.staff.length + chatters.admins.length + chatters.global_mods.length;
        
        const counts = this.shadowRoot.querySelector('.user-list-counts');
        counts.innerHTML = "";
        if(staffCount > 0) {
            counts.innerHTML += `Staff: ${formatNumber(staffCount)}  `;
        }
        if(vipCount > 0) {
            counts.innerHTML += `VIPs: ${formatNumber(vipCount)}  `;
        }
        if(modCount > 0) {
            counts.innerHTML += `Mods: ${formatNumber(modCount)}  `;
        }
        counts.innerHTML += `Viewers: ${(viewerCount)}`;

        this.update();
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .list,
            .preview {
                min-height: 10px;
                border-radius: 3px;
                background: #1f1f23f0;
                backdrop-filter: blur(12px);
                box-shadow: rgb(0 0 0 / 25%) 1px 2px 8px;
                padding: 6px 10px;
                font-size: 12px;
                color: #eee;
            }
            .preview {
                white-space: nowrap;
                margin-bottom: 2px;
            }
            .list {
                max-height: 500px;
                overflow: auto;
                font-size: 14px;
            }
            .user-search {
                margin-bottom: 5px;
                width: 100%;
                background: transparent;
                border: none;
                border-bottom: 1px solid grey;
                padding: 6px 8px;
                box-sizing: border-box;
            }
            .full-list {

            }
            .list-title {
                margin: 15px 0 8px 0;
                color: rgb(185 185 185);
            }
            .user {

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
        const renderList = (arr) => {
            return arr.map(username => {
                return html`<div class="user">${username}</div>`;
            });
        }
        return html`
            <div class="preview">
                <span class="user-list-counts"></span>
            </div>

            ${this.list ? html`
                <div class="list">
                    <input class="user-search" placeholder="Search user"/>
                    <div class="full-list">
                        <div class="list-title">Braodcast</div>
                        ${renderList(this.list.broadcaster)}
                        <div class="list-title">Staff</div>
                        ${renderList(this.list.staff)}
                        <div class="list-title">Mods</div>
                        ${renderList(this.list.moderators)}
                        <div class="list-title">VIPs</div>
                        ${renderList(this.list.vips)}
                        <div class="list-title">Viewers</div>
                        ${renderList(this.list.viewers)}
                    </div>
                </div>
            ` : ""}
        `;
    }
}

customElements.define('chat-user-list', ChatUserList);