import { css, html, LitElement } from 'lit-element';
import AnimatedScroll from '../AnimatedScroll';
import { ChatInfoMessage, ChatMessage } from '../MessageParser';
import { ChatInfo, ChatLine, ChatNote } from './ChatLine';
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

    appendMessage(msg: ChatMessage, sourceChat: Chat = this) {
        const line = new ChatLine(sourceChat, msg);
        this.appendChild(line);
        setTimeout(() => {
            this.afterAppend();
        }, 1);
        return line;
    }

    appendInfo(msg: ChatInfoMessage) {
        const line = new ChatInfo(msg);
        this.appendChild(line);
        setTimeout(() => {
            this.afterAppend();
        }, 1);
    }

    appendNote(text: string) {
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

        if(scrollEle.scrollHeight > 0 && this.scrollLock) {
            const latest = (scrollEle.scrollHeight - scrollEle.clientHeight);
            this.scrollTarget = latest;
            AnimatedScroll.scrollTo(latest, scrollEle);
        }
    }

    afterAppend() {
        const scrollEle = this.shadowRoot?.querySelector('.lines');
        if(!scrollEle) return;

        this.scrollTarget = scrollEle.scrollTop;

        const latest = (scrollEle.scrollHeight - scrollEle.clientHeight);

        if(this.scrollTarget >= latest - 1) {
            this.lock();
        } 
        if(this.scrollTarget < latest - 1000) {
            this.unlock();
        }

        // clean out buffer
        if (this.children.length > this.MAX_BUFFER_SIZE) {
            const rest = (this.children.length - this.MAX_BUFFER_SIZE);
            for (let i = 0; i < rest; i++) {
                this.children[i].remove();
            }
        }

        // update scroll position
        requestAnimationFrame(() => this.scrollToLatest());
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
            this.scrollTarget = scrollEle.scrollTop;
            if (e.deltaY < 0) {
                this.unlock();
            }
            const latest = (scrollEle.scrollHeight - scrollEle.clientHeight);
            if (scrollEle.scrollTop + e.deltaY >= latest) {
                this.lock();
            }
            this.afterAppend();
        })
    }

    placeBookmarkLine() {
        if(this.bookmark) {
            this.removeBookmarkLine();
        }
        const line = document.createElement('div');
        line.className = "bookmark";
        this.appendChild(line);
        this.bookmark = line;
    }

    removeBookmarkLine() {
        if(this.bookmark) {
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
            .lines {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                overflow-y: scroll;
                overflow-x: hidden;
                padding-top: 30px;
            }

            .chat-actions {
                width: 100%;
                background: rgb(25 25 28);
                position: relative;
                z-index: 1000;
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                padding: 8px 8px;
                box-sizing: border-box;
                z-index: 1000;
            }

            .chat-title {
                grid-column: 2;
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

            .chat-channel-name {
                opacity: 0.75;
                font-size: 12px;
                font-weight: 400;
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
