// http://tmi.twitch.tv/group/user/{{username}}/chatters

import { css, html, LitElement } from "lit";
import IRC from "../services/IRC";
import Format from "../util/Format";

export default class ChatUserList extends LitElement {
  static get properties() {
    return {
      channel: String,
    };
  }

  channel: string;
  list: Array<any>;
  filter: string = "";

  updateList() {
    this.request();
  }

  async request() {
    const list = await IRC.getUserlist(this.channel);
    this.list = list.chatters;

    const chatters = list.chatters;

    const viewerCount = chatters.viewers.length;
    const modCount = chatters.moderators.length;
    const vipCount = chatters.vips.length;
    const staffCount =
      chatters.staff.length +
      chatters.admins.length +
      chatters.global_mods.length;

    const counts = this.shadowRoot.querySelector(".user-list-counts");
    counts.innerHTML = "";
    if (staffCount > 0) {
      counts.innerHTML += `<img height="16px" width="16px" src="./images/Staff.svg"/> ${Format.number(
        staffCount
      )}  `;
    }
    if (modCount > 0) {
      counts.innerHTML += `<img height="16px" width="16px" src="./images/Mod.svg"/> ${Format.number(
        modCount
      )}  `;
    }
    if (vipCount > 0) {
      counts.innerHTML += `<img height="16px" width="16px" src="./images/VIP.svg"/> ${Format.number(
        vipCount
      )}  `;
    }
    counts.innerHTML += `<img height="16px" width="16px" src="./images/Viewer.svg"/> ${Format.number(
      viewerCount
    )}`;

    this.requestUpdate();
  }

  static get styles() {
    return css`
      @keyframes userlist-slidein {
        from {
          transform: translate(0, -10px);
          opacity: 0;
        }
      }
      :host {
        display: block;
        animation: userlist-slidein 0.2s ease;
        z-index: 10000000;
      }
      .list,
      .preview {
        min-height: 10px;
        border-radius: 3px;
        background: #1f1f23f0;
        backdrop-filter: blur(12px);
        box-shadow: rgb(0 0 0 / 25%) 1px 2px 8px;
        padding: 10px 10px;
        font-size: 12px;
        color: #eee;
        border: 1px solid #303030;
        min-width: 200px;
        max-width: 400px;
      }
      .preview {
        white-space: nowrap;
        margin-bottom: 5px;
      }
      .list {
        max-height: 500px;
        overflow: auto;
        font-size: 14px;
      }
      .user-search {
        color: #eee;
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
      .user-list-counts {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .user-list-counts img:not(:first-child) {
        margin-left: 15px;
      }
      .user-list-counts img {
        margin-right: 5px;
      }

      /* // webkit scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        margin: 5px 0;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-track-piece {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-scrollbar-thumb, #464646);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-scrollbar-thumb-hover, #555555);
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
  }

  setFilter(str: string) {
    this.filter = str;
    this.requestUpdate();
  }

  render() {
    const renderList = (arr) => {
      return arr
        .filter((username) => {
          return username.match(this.filter);
        })
        .map((username) => {
          return html`<div class="user">${username}</div>`;
        });
    };
    return html`
      <div class="preview">
        <span class="user-list-counts"></span>
      </div>

      ${this.list
        ? html`
            <div class="list">
              <input
                class="user-search"
                placeholder="Search user"
                @input="${(e) => {
                  this.setFilter(e.target.value);
                }}"
              />
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
          `
        : ""}
    `;
  }
}

customElements.define("chat-user-list", ChatUserList);
