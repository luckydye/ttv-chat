import { css, html, LitElement } from 'lit-element';
import IRCChatClient from '../services/IRCChatClient';
import { Application } from '../App';

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
                resize: none;
                border-radius: 4px;
                background: hsl(240deg 4% 19%);
                width: 100%;
                border: none;
                outline: none;
                padding: 13px 12px 15px 12px;
                color: #eee;
                font-family: 'Open Sans', sans-serif;
                box-sizing: border-box;
            }
            .util {
                position: absolute;
                right: 0;
                top: 10px;
                padding: 0 10px;
            }
            button {
                border-radius: 4px;
                border: none;
                padding: 4px;
                min-width: 25px;
                min-height: 25px;
                background: hsl(240deg, 2%, 41%);
                margin: 0;
                cursor: pointer;
                color: #fff;
            }
            button:hover {
                background: hsl(240deg, 2%, 44%);
            }
            button:active {
                background: hsl(240deg, 2%, 30%);
            }
        `;
    }

    constructor() {
        super();

        window.addEventListener('paste', e => {
            if(document.activeElement == document.body) {
                const ele = this.shadowRoot?.querySelector('textarea');
                const data = e.clipboardData.items[0];
                data.getAsString(str => {
                    ele?.value += str;
                    ele?.focus();
                });
            }
        })

        window.addEventListener('keydown', e => {
            if(document.activeElement == document.body) {
                const ele = this.shadowRoot?.querySelector('textarea');
                ele?.focus();
            }
        })
    }

    submit(e: KeyboardEvent) {
        const ele = e.target;
        const value = ele.value;
        ele.value = "";
        IRCChatClient.sendMessage(Application.getSelectedRoom(), value);
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
                        <textarea @keydown="${this.handleKeyDown}" placeholder="Send a message" rows="1"></textarea>
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