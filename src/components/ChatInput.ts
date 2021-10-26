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
                background: #101010;
                position: relative;
                display: grid;
                grid-template-columns: 1fr auto;
                align-items: center;
                border-radius: 4px;
            }
            .text-input {

            }
            .text-input textarea {
                width: 100%;
                background: transparent;
                border: none;
                outline: none;
                padding: 5px;
                color: #eee;
                font-family: 'Open Sans', sans-serif;
            }
            .util {
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