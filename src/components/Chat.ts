import { css, html, LitElement, TemplateResult } from 'lit-element';
import AnimatedScroll from './AnimatedScroll';
import { ChatInfoMessage, ChatMessage } from '../MessageParser';
import { ChatInfo, ChatNote } from './ChatLine';
import { render } from 'lit-html';
// Components
import './FluidInput';
import './Timer';
import './UserList';

export default class Chat extends LitElement {

    MAX_BUFFER_SIZE = 500;

    scrollLock = true;
    roomName: string = "";
    scrollTarget: number = 0;

    bookmark: HTMLElement;

    appendMessage(msg: ChatMessage) {
        const line = document.createElement('chat-line');

        line.setAttribute('messageid', msg.id);
        line.setAttribute('userid', msg.user_id);
        line.setAttribute('timestamp', msg.timestamp.valueOf());

        if (msg.tagged) {
            line.setAttribute('tagged', '');
        }
        if (msg.highlighted) {
            line.setAttribute('highlighted', '');
        }
        if (msg.action) {
            line.setAttribute('action', '');
        }

        line.message = msg;

        render(msg.content, line);

        this.appendChild(line);
        this.afterAppend();
        return line;
    }

    appendInfo(msg: ChatInfoMessage) {
        const line = new ChatInfo(msg);
        this.appendChild(line);
        this.afterAppend();
    }

    appendNote(text: string | TemplateResult) {
        const line = new ChatNote(text);
        this.appendChild(line);
        this.afterAppend();
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
        if (!scrollEle) return;

        this.scrollTarget = scrollEle.scrollHeight;
        AnimatedScroll.scrollTo(this.scrollTarget, scrollEle);
    }

    toLatest() {
        const scrollEle = this.shadowRoot?.querySelector('.lines');
        if (!scrollEle) return;
        this.scrollTarget = scrollEle.scrollHeight;
        scrollEle.scrollTo(0, this.scrollTarget);
    }

    updateLock() {
        const scrollEle = this.shadowRoot?.querySelector('.lines');
        if (!scrollEle) return;

        const latest = scrollEle.scrollHeight - scrollEle.clientHeight;

        if (this.scrollTarget >= latest - 40) {
            this.lock();
        }
        if (this.scrollTarget <= latest - 10) {
            this.unlock();
        }
    }

    afterAppend() {
        // update scroll position
        if (this.scrollLock) {
            setTimeout(() => {
                this.scrollToLatest();
            }, 10);
        }

        // clean out buffer
        if (this.children.length > this.MAX_BUFFER_SIZE + 20) {
            const rest = (this.children.length - this.MAX_BUFFER_SIZE);
            for (let i = 0; i < rest; i++) {
                this.children[i].remove();
            }
        }
    }

    setRoom(roomName: string) {
        this.roomName = roomName;
        this.update();
        this.setAttribute('name', this.roomName);
    }

    constructor() {
        super();

        this.addEventListener('wheel', e => {
            const scrollEle = this.shadowRoot?.querySelector('.lines');
            if (scrollEle) {
                this.scrollTarget = scrollEle.scrollTop + e.deltaY;
                
                setTimeout(() => {
                    this.updateLock();
                }, 500);

                if (e.deltaY < 0) {
                    this.unlock();
                }
            }
        })
    }

    connectedCallback() {
        super.connectedCallback();

        const scrollEle = this.shadowRoot?.querySelector('.lines');
        if (scrollEle) {
            scrollEle.scrollTo(0, this.scrollTarget);

            scrollEle.addEventListener('scroll', e => {
                this.updateLock();
            });
        }
    }

    placeBookmarkLine() {
        if (this.bookmark) {
            this.removeBookmarkLine();
        }
        const line = document.createElement('div');
        line.className = "bookmark";
        this.appendChild(line);
        this.bookmark = line;
    }

    removeBookmarkLine() {
        if (this.bookmark) {
            this.bookmark.remove();
        }
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

            .header {
                background: rgba(25, 25, 28, 0.75);
                backdrop-filter: blur(24px);
                background: rgba(25, 25, 28, 0.9);
                backdrop-filter: blur(24px);
                position: relative;
                z-index: 1000;
                border-bottom: 1px solid black;
            }
            
            .lines {
                padding-top: 30px;
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                overflow-y: scroll;
                overflow-x: hidden;
            }
            .line {

            }

            .chat-actions {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                padding: 4px 8px;
                box-sizing: border-box;
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

            .scroll-to-bottom {
                transition: opacity .125s ease, transform .125s ease;
                transform: translate(0, 10px); 
                opacity: 0;
                pointer-events: none;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgb(8 8 8 / 75%);
                backdrop-filter: blur(12px);
                padding: 8px 15px;
                text-align: center;
                box-sizing: border-box;
                z-index: 100000;
                cursor: pointer;
                margin: 4px 40px;
                border-radius: 6px;
                border: 1px solid #19191b;
            }

            :host(:not([locked])) .scroll-to-bottom {
                transform: translate(0, 0);
                opacity: 1;
                pointer-events: all;
                transition: opacity .25s ease, transform .25s ease;
            }

            :host(:not([locked])) .scroll-to-bottom:hover {
                transform: scale(1.005);
                transition: none;
            }
            :host(:not([locked])) .scroll-to-bottom:active {
                transform: scale(0.995);
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

            .chat-channel-name {
                opacity: 0.75;
                font-size: 12px;
                font-weight: 400;
            }
            .chat-channel-name:hover {
                text-decoration: underline;
                cursor: pointer;
            }
            .chat-channel-name:active {
                opacity: 0.5;
            }
            :host([modview]) .chat-channel-name {
                display: none;
            }
        `;
    }

    render() {
        return html`
            <div class="chat-actions">
                <div></div>
                <div class="chat-channel-name">
                    ${this.roomName}
                </div>
                <div class="chat-state-icons"></div>
            </div>
            <div class="scroll-to-bottom" @click="${() => this.lock()}">
                <span>Scroll to the bottom</span>
            </div>
            <div class="lines">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('sample-chat', Chat);
