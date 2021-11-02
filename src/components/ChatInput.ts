import { css, html, LitElement } from 'lit-element';
import IRC from '../services/IRC';
import Application from '../App';
import EmotePicker from './EmotePicker';

const MAX_HSITORY_LENGTH = 20;

export default class ChatInput extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
            }
            :host([disabled]) {
                pointer-events: none;
                opacity: 0;
            }
            .wrapper {
                padding: 8px;
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
                font-family: 'Roboto', sans-serif;
                font-size: 14px;
                box-sizing: border-box;
                display: block;
                transition: outline .2s ease;
                outline: 2px solid transparent;
            }
            .text-input textarea:focus {
                outline-color: #1f1f23;
            }
            .util {
                position: absolute;
                right: 0;
                top: 7px;
                padding: 0 10px;
                display: grid;
                grid-auto-flow: column;
                grid-gap: 5px;
            }
            button {
                border-radius: 4px;
                border: none;
                padding: 4px;
                min-width: 25px;
                min-height: 25px;
                background: transparent;
                margin: 0;
                cursor: pointer;
                color: #fff;
            }
            button:hover {
                background: #34343a;
            }
            button:active {
                transform: scale(0.95);
            }
            button img {
                display: block;
            }
        `;
    }

    history: Array<string> = [];
    historyPointer: number = -1;

    set value(v: string) {
        const ele = this.shadowRoot?.querySelector('textarea');
        ele.value = v;
    }

    get value() {
        const ele = this.shadowRoot?.querySelector('textarea');
        return ele.value;
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
            if(document.activeElement == document.body && !e.ctrlKey) {
                const ele = this.shadowRoot?.querySelector('textarea');
                ele?.focus();
            }
        })
    }

    submit(e: KeyboardEvent) {
        if(this.value != "") {
            this.addToHistory(this.value);
            IRC.sendMessage(Application.getSelectedRoom(), this.value);
            this.value = "";
        }
    }

    loadHistory() {
        const history = localStorage.getItem('input-history');
        if(history && history instanceof Array) {
            this.history = JSON.parse(history);
        }
    }

    saveHistory() {
        localStorage.setItem('input-history', JSON.stringify(this.history));
    }

    addToHistory(value: string) {
        this.history.unshift(value);
        if(this.history.length > MAX_HSITORY_LENGTH) {
            this.history.pop();
        }
    }

    prevHistoryValue() {
        this.historyPointer = Math.max(this.historyPointer - 1, 0);
        const historyValue = this.history[this.historyPointer];
        if(historyValue) {
            this.value = historyValue;
        }
    }

    nextHistoryValue() {
        this.historyPointer = Math.min(this.historyPointer + 1, this.history.length - 1);
        const historyValue = this.history[this.historyPointer];
        if(historyValue) {
            this.value = historyValue;
        }
    }

    resetHistoryValue() {
        this.historyPointer = -1;
    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.key == "Enter") {
            this.submit(e);
            this.resetHistoryValue();
            e.preventDefault();
        }
        if(e.key == "ArrowUp") {
            this.nextHistoryValue();
            e.preventDefault();
        }
        if(e.key == "ArrowDown") {
            this.prevHistoryValue();
            e.preventDefault();
        }
    }

    openEmotePicker(e) {
        EmotePicker.openOn(e.target, 'up');
    }

    insert(emote: string) {
        const ele = this.shadowRoot?.querySelector('textarea');
        if(ele) {
            const part1 = ele.value.slice(0, ele.selectionStart);
            const part2 = ele.value.slice(ele.selectionStart);
    
            const newValue = [part1, emote, part2].join(" ");
            ele.value = newValue;
        }
    }

    focus() {
        const ele = this.shadowRoot?.querySelector('textarea');
        ele?.focus();
    }

    render() {
        return html`
            <div class="wrapper">
                <div class="input-field">
                    <div class="text-input">
                        <textarea @keydown="${this.handleKeyDown}" placeholder="Send a message" rows="1"></textarea>
                    </div>
                    <div class="util">
                        <!-- <button name="create poll">Y</button>
                        <button name="create prediction">X</button> -->
                        <button name="Emotes" @click="${this.openEmotePicker}">
                            <img src="./images/sentiment_satisfied_alt_white_24dp.svg" width="22px" height="22px"/>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('chat-input', ChatInput);