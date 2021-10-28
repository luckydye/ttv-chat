// http://tmi.twitch.tv/group/user/{{username}}/chatters

import { css, html, LitElement } from 'lit-element';

export default class ChatUserList extends LitElement {

    static get properties() {
        return {
            channel: String,
        };
    }

    channel: string;
    list: Array<any>;

    connectedCallback() {
        super.connectedCallback();

        this.fetchUserlist(this.channel).then(list => {
            console.log(list);
            this.list = list;
            this.update();
        })
    }

    fetchUserlist(username) {
        return fetch(`http://tmi.twitch.tv/group/user/${username}/chatters`)
            .then(res => res.json())
            .then(list => {
                return list;
            })
            .catch(err => {
                console.error('Error fetching user list', err);
            })
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    render() {
        return html`
            <div>${this.list}</div>
        `;
    }
}

customElements.define('chat-user-list', ChatUserList);