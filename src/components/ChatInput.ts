import { css, html, LitElement } from 'lit-element';
import IRC from '../services/IRC';
import Application from '../App';
import EmotePicker from './EmotePicker';
import TwitchCommands from '../services/twitch/TwichCommands';

const MAX_HSITORY_LENGTH = 20;

export default class ChatInput extends LitElement {

    inputElement: HTMLElement;

    history: Array<string> = [];
    historyPointer: number = -1;

    commandCharacter: string = "/";

    set value(v: string) {
        const ele = this.getInputElement();
        ele.innerHTML = v;
    }

    get value() {
        const ele = this.getInputElement();
        if(this.commandMode) {
            return this.commandCharacter + ele.innerText;
        } else {
            return ele.innerText;
        }
    }

    set commandMode(val: boolean) {
        if(val === true) {
            this.inputElement.setAttribute('command', this.commandCharacter);
        } else {
            this.inputElement.removeAttribute('command');
        }
    }

    get commandMode() {
        return this.inputElement.hasAttribute('command');
    }

    getInputElement() {
        return this.inputElement;
    }

    submit(e: KeyboardEvent) {
        if (this.value != "") {
            this.addToHistory(this.value);
            const channel = Application.getChannel(Application.getSelectedChannel());
            IRC.sendMessage(channel.channel_login, channel.channel_id, this.value);
        }
    }

    loadHistory() {
        const history = localStorage.getItem('input-history');
        if (history && history instanceof Array) {
            this.history = JSON.parse(history);
        }
    }

    saveHistory() {
        localStorage.setItem('input-history', JSON.stringify(this.history));
    }

    addToHistory(value: string) {
        this.history.unshift(value);
        if (this.history.length > MAX_HSITORY_LENGTH) {
            this.history.pop();
        }
    }

    prevHistoryValue() {
        this.historyPointer = Math.max(this.historyPointer - 1, 0);
        const historyValue = this.history[this.historyPointer];
        if (historyValue) {
            this.value = historyValue;
        }
    }

    nextHistoryValue() {
        this.historyPointer = Math.min(this.historyPointer + 1, this.history.length - 1);
        const historyValue = this.history[this.historyPointer];
        if (historyValue) {
            this.value = historyValue;
        }
    }

    openEmotePicker(e) {
        EmotePicker.openOn(e.target, 'up');
    }

    insert(str: string) {
        const ele = this.getInputElement();
        const index = this.getCursorPosition();
        const part1 = ele.innerText.slice(0, index);
        const part2 = ele.innerText.slice(index);

        const newValue = [part1, str, part2].join(" ");
        this.value = newValue;

        ele.focus();
        this.setCursorPosition(1);
    }

    focus() {
        this.getInputElement().focus();
    }

    getCursorPosition() {
        if(this.shadowRoot) {
            return this.shadowRoot.getSelection().focusOffset;
        }
    }

    setCursorPosition(index: number) {
        if(this.shadowRoot) {
            const el = this.inputElement;
            const range = document.createRange();
            const sel = this.shadowRoot.getSelection();
            
            range.setStart(el, index);
            range.collapse(true);
            
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    resetInput() {
        this.value = "";
        this.historyPointer = -1;
        this.commandMode = false;
    }

    handleKeyDown(e: KeyboardEvent) {
        if (e.key == "Enter") {
            this.submit(e);
            this.resetInput();
            e.preventDefault();
        }
        if (e.key == "ArrowUp") {
            this.nextHistoryValue();
            e.preventDefault();
        }
        if (e.key == "ArrowDown") {
            this.prevHistoryValue();
            e.preventDefault();
        }
        if (e.key == "Tab") {
            e.preventDefault();
            // autocomplete sugestion
            if(this.value.length > 2) {
                const sugs = this.commandSugestions();

                let cmd = sugs[0];
                if(cmd.command == this.inputElement.innerText && sugs.length > 1) {
                    cmd = sugs[1];
                }
                if(cmd) {
                    this.inputElement.innerText = cmd.command;
                    requestAnimationFrame(() => {
                        this.setCursorPosition(1);
                    });
                }
            }
        }

        if(this.value == "" && e.key == "/") {
            e.preventDefault();
            this.enableCommandMode("/");
        }

        if(this.value == "" && e.key == "!") {
            e.preventDefault();
            this.enableCommandMode("!");
        }
    }

    enableCommandMode(prefix: string = "/") {
        this.commandCharacter = prefix;
        this.inputElement.innerHTML += "<br>";
        requestAnimationFrame(() => {
            this.setCursorPosition(1);
        });
        this.commandMode = true;
    }

    handleKeyUp(e: KeyboardEvent) {
        if (e.key == "Backspace") {
            if(this.inputElement.innerText.length == 1 || this.inputElement.innerText == "") {
                this.resetInput();
            }
        }

        if(this.commandMode) {
            // realtime sugestions
        }
    }

    commandSugestions() {
        const sugestions = [];
        for(let cmd of TwitchCommands) {
            if(cmd.command.match(this.inputElement.innerText)) {
                sugestions.push(cmd);
            }
        }
        return sugestions;
    }

    constructor() {
        super();

        this.inputElement = document.createElement("div");
        this.inputElement.id = "chat-input";
        this.inputElement.contentEditable = "true";
        this.inputElement.setAttribute('placeholder', "Send a message");
        this.inputElement.setAttribute('empty', '');
        this.inputElement.addEventListener('keydown', e => {
            this.handleKeyDown(e);
        });
        this.inputElement.addEventListener('keyup', e => {
            this.handleKeyUp(e);
        });
        this.inputElement.addEventListener('focus', e => {
            this.inputElement.removeAttribute('empty');
        });
        this.inputElement.addEventListener('blur', e => {
            if (this.value == "") {
                this.inputElement.setAttribute('empty', '');
            }
        });
        this.inputElement.addEventListener('click', e => {
            this.focus();
        });

        window.addEventListener('paste', e => {
            if (document.activeElement == document.body) {
                const ele = this.getInputElement();
                const data = e.clipboardData.items[0];
                data.getAsString((str: string) => {
                    this.insert(str);
                    ele.focus();
                });
            }
        })

        window.addEventListener('keydown', e => {
            if (document.activeElement == document.body && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                const ele = this.getInputElement();
                ele?.focus();
            }
        })
    }

    render() {
        return html`
            <div class="wrapper">
                <div class="input-field">
                    <div class="text-input">
                        ${this.inputElement}
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
            .text-input #chat-input {
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
            .text-input #chat-input:focus {
                outline-color: #1f1f23;
            }
            .text-input #chat-input::after {
                content: attr(placeholder);
                display: none;
                transition: opacity 0.1s ease;
                pointer-events: none;
            }
            .text-input #chat-input[empty]::after {
                display: block;
                opacity: 0.5;
            }
            .text-input #chat-input[command]::before {
                content: attr(command);
                display: inline-block; 
                background: #1f1f23;
                padding: 4px 8px;
                border-radius: 4px;
                margin-right: 5px;
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
}

customElements.define('chat-input', ChatInput);