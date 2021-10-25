import { css, html, LitElement } from 'lit-element';

export default class ChatInput extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
            }
            .wrapper {
                padding: 10px;
            }
            .input-field {
                background: rgb(51, 51, 51);
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
            .identity {

            }
        `;
    }

    constructor() {
        super();

        
    }

    render() {
        return html`
            <div class="wrapper">
                <div class="input-field">
                    <div class="text-input">
                        <textarea placeholder="Message"></textarea>
                    </div>
                    <div class="util">
                        <button name="create poll">Y</button>
                        <button name="create prediction">X</button>
                        <button name="Emotes">X</button>
                    </div>
                </div>
                <div class="identity">
                    Identity
                </div>
            </div>
        `;
    }
}

customElements.define('chat-input', ChatInput);