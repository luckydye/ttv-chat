import { css, html, LitElement } from 'lit-element';
import { ChatMessage, ChatInfoMessage } from '../MessageParser';
import Chat from './Chat';

export class ChatLine extends LitElement {

    message: ChatMessage;
    chat: Chat | null = null;

    constructor(chat: Chat, msg: ChatMessage) {
        super();

        this.chat = chat;
        this.message = msg;

        setTimeout(() => {
            this.update();
        }, 100);
    }

    connectedCallback() {
        super.connectedCallback();

        this.setAttribute('messageid', this.message.id);
        this.setAttribute('userid', this.message.user_id);
        this.setAttribute('timestamp', this.message.timestamp.valueOf());

        if(this.message.tagged) {
            this.setAttribute('tagged', '');
        }
        if(this.message.highlighted) {
            this.setAttribute('highlighted', '');
        }
        if(this.message.action) {
            this.setAttribute('action', '');
        }
    }

    createRenderRoot() {
        return this;
    }

    // jumpToChat() {
    //     Application.selectRoom(this.message.channel);
    // }

    // timeout(s: number = 10) {
    //     IRCChatClient.sendCommand(this.message.channel, `/timeout ${this.message.user_name} ${s}`);
    // }

    // openThread() {
    //     // gotta implement this and user cards
    // }

    // reply() {
    //     // reply to this message
    // }

    render() {
        return this.message.content;
    }

}


export class ChatInfo extends LitElement {

    message: ChatInfoMessage;

    constructor(msg: ChatInfoMessage) {
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
        return this.message.content;
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
                display: inline-flex;
            }
            img {
                margin: 0 4px;
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
