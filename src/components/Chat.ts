import { css, html, LitElement } from 'lit-element';
import { ChatMessage } from '../services/IRCChatClient';

export default class TwitchChat extends LitElement {

    MAX_BUFFER_SIZE = 1000;

    scrollTarget = 0;
    scrollLock = true;

    appendMessage(msg: ChatMessage) {
        const line = new ChatLine(msg);
        this.appendChild(line);
    }

    constructor() {
        super();

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
            <div>Chat</div>
            <div class="lines">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('twitch-chat', TwitchChat);

class ChatLine extends LitElement {

    message: ChatMessage | null = null;

    constructor(msg: ChatMessage) {
        super();

        this.message = msg;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .username {
                color: var(--color);
                display: inline;
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
                    <div class="username" style="--color: ${this.message.color}">${this.message.username}</div>:
                    <div class="message">${this.message.message}</div>
                </div>
            `;
        }
    }

}

customElements.define('chat-line', ChatLine);