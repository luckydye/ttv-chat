import { css, html, LitElement } from 'lit-element';

export default class TwitchChat extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                max-height: 90vh;
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

    chatBuffer = [];
    MAX_BUFFER_SIZE = 1000;

    scrollTarget = 0;

    scrollLock = true;

    appendLine(line) {
        this.chatBuffer.push(line);
        this.update();
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
            if (this.chatBuffer.length > this.MAX_BUFFER_SIZE && this.scrollLock === true) {
                const rest = (this.chatBuffer.length - this.MAX_BUFFER_SIZE);
                this.chatBuffer.splice(0, rest);
            }

            requestAnimationFrame(update);
        }

        update();
    }

    render() {
        return html`
            <div>Chat</div>
            <div class="lines">
                ${this.chatBuffer.map(line => {
                    return html`<div class="line">${line}</div>`;
                })}
            </div>
        `;
    }
}

customElements.define('twitch-chat', TwitchChat);