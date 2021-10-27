import { css, html, LitElement } from 'lit-element';
import IRCChatClient from '../services/IRCChatClient';

export default class ChatInput extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
            }
            .wrapper {
                padding: 10px;
            }
            .input-field {
                position: relative;
                display: grid;
                grid-template-columns: 1fr auto;
                align-items: center;
            }
            .text-input {

            }
            .text-input textarea {
                border-radius: 4px;
                background: hsl(240deg 4% 19%);
                width: 100%;
                border: none;
                outline: none;
                padding: 5px;
                color: #eee;
                font-family: 'Open Sans', sans-serif;
                box-sizing: border-box;
            }
            .util {
                position: absolute;
                right: 0;
                top: 12px;
                padding: 0 10px;
            }
            button {

            }
        `;
    }

    constructor() {
        super();

    }

    submit(e: KeyboardEvent) {
        const ele = e.target;
        const value = ele.value;
        ele.value = "";
        IRCChatClient.sendMessage('luckydye', value);
    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.key == "Enter") {
            this.submit(e);
            e.preventDefault();
        }
    }

    render() {
        return html`
            <div class="wrapper">
                <div class="input-field">
                    <div class="text-input">
                        <textarea @keydown="${this.handleKeyDown}" placeholder="Message"></textarea>
                    </div>
                    <div class="util">
                        <button name="create poll">Y</button>
                        <button name="create prediction">X</button>
                        <button name="Emotes">X</button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('chat-input', ChatInput);