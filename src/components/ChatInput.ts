import { CommandList, UserLevel } from './../services/CommandList';
import { css, html, LitElement } from 'lit-element';
import IRC from '../services/IRC';
import Application from '../App';
import EmotePicker from './EmotePicker';
import Emotes from '../services/Emotes';

// TODO: Emote Sugestions

const MAX_HSITORY_LENGTH = 20;

export default class ChatInput extends LitElement {

    inputElement: HTMLElement;

    history: Array<string> = [];
    historyPointer: number = -1;

    commandSugestionsList: Array<any> = [];
    commandCharacter: string = "/";

    replyId: string | undefined;

    set value(v: string) {
        const ele = this.getInputElement();
        ele.innerHTML = v;
    }

    get value() {
        const ele = this.getInputElement();
        if(this.commandMode && (this.commandCharacter == "!" || this.commandCharacter == "/")) {
            return this.commandCharacter + ele.innerText;
        } else {
            return ele.innerText;
        }
    }

    set commandMode(val: boolean) {
        if(val === true) {
            this.inputElement.setAttribute('command', this.commandCharacter);
            this.setAttribute('command', this.commandCharacter);
        } else {
            this.inputElement.removeAttribute('command');
            this.removeAttribute('command');
        }
    }

    get commandMode() {
        return this.hasAttribute('command');
    }

    getInputElement() {
        return this.inputElement;
    }

    submit(e: KeyboardEvent) {
        if (this.value != "") {
            this.addToHistory(this.value);
            const channel = Application.getChannel(Application.getSelectedChannel());
            if(this.replyId) {
                IRC.replyToMessage(channel.channel_login, channel.channel_id, this.value, this.replyId);
            } else {
                IRC.sendMessage(channel.channel_login, channel.channel_id, this.value);
            }
        }
    }

    reply(message_sender: string, message_id: string) {
        this.enableCommandMode(message_sender);
        this.replyId = message_id;
        this.insert("<br>");
        this.focus();
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
        this.commandSugestionsList = [];
        this.replyId = undefined;
        this.update();
    }

    enableCommandMode(prefix: string = "/") {
        this.commandCharacter = prefix;
        this.inputElement.innerHTML += "<br>";
        requestAnimationFrame(() => {
            this.setCursorPosition(1);
        });
        this.commandMode = true;
    }

    async autocomplete() {
        if(this.value.length >= 1) {
            // sugest commands
            const sugs = this.commandSugestionsList;
            let cmd = sugs[sugs.length-1];
            if(cmd) {
                if(cmd.command.replace(this.commandCharacter, "") == this.inputElement.innerText && sugs.length > 1) {
                    cmd = sugs[sugs.length-2];
                }
                this.inputElement.innerText = cmd.command.replace(this.commandCharacter, "");
                this.setCursorPosition(1);
                return;
            }

            const words = this.inputElement.innerText.split(" ");
            const currWord = words[words.length-1];

            // suggest emotes
            const emotes = await this.getEmnoteSugestions(currWord);
            if(emotes[0]) {
                this.inputElement.innerText = words.slice(0, words.length - 1).join(" ") + " " + emotes[0];
                this.setCursorPosition(1);
                return;
            }

            // suggest names
            const names = this.getNameSugestions(currWord);

            if(names[0]) {
                this.inputElement.innerText = words.slice(0, words.length - 1).join(" ") + " " + names[0];
                this.setCursorPosition(1);
            }
        }
    }

    handleKeyDown(e: KeyboardEvent) {
        if (e.key == "Enter") {
            this.submit(e);
            this.resetInput();
            e.preventDefault();
        }
        if (e.key == "ArrowUp") {
            if(this.commandMode) {
                // move command sugestion pointer up
            } else {
                this.nextHistoryValue();
            }
            e.preventDefault();
        }
        if (e.key == "ArrowDown") {
            if(this.commandMode) {
                // move command sugestion pointer down
            } else {
                this.prevHistoryValue();
            }
            e.preventDefault();
        }
        if (e.key == "Tab") {
            e.preventDefault();
            this.autocomplete();
        }

        if(this.value == "" && e.key == "/") {
            e.preventDefault();
            this.enableCommandMode("/");
        }

        if(this.value == "" && e.key == "!") {
            e.preventDefault();
            this.enableCommandMode("!");
        }

        if (e.key == "Backspace") {
            if(this.inputElement.innerText.length == 0 || 
                this.inputElement.innerText == " " ||
                this.inputElement.innerText == "\n" ||
                this.inputElement.innerText == "") {
                this.resetInput();
            }
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        if (e.key == "Backspace") {
            if(this.inputElement.innerText.length == 0 || 
                this.inputElement.innerText == " " ||
                this.inputElement.innerText == "\n" ||
                this.inputElement.innerText == "") {
                this.resetInput();
            }
        }

        if(this.commandMode && this.value.length >= 0) {
            this.getCommandSugestions(this.inputElement.innerText, list => {
                this.commandSugestionsList = list;
                
                this.update();

                setTimeout(() => {
                    const ele = this.shadowRoot?.querySelector('.flyout');
                    ele?.scrollTo(0, ele.scrollHeight);
                }, 1);
            });
        }
    }

    getNameSugestions(str: string) {
        const channel = Application.getChannel(Application.getSelectedChannel());
        if(channel) {
            const chatters = channel.chatters;
            return chatters.filter(name => name.toLocaleLowerCase().match(str.toLocaleLowerCase()));
        }
        return [];
    }

    async getEmnoteSugestions(str: string): Promise<Array<string>> {
        const channel = Application.getChannel(Application.getSelectedChannel());
        if(channel) {
            const global = await Emotes.getGlobalEmotes();
            const chnl = await Emotes.getChannelEmotes(channel.channel_id);
            const allEmtoes = [];

            for(let serivce in global) {
                if(chnl) {
                    for(let emote in chnl[serivce]) {
                        allEmtoes.push(emote);
                    }
                }
                for(let emote in global[serivce]) {
                    allEmtoes.push(emote);
                }
            }

            return allEmtoes.filter(name => name.toLocaleLowerCase().match(str.toLocaleLowerCase()));
        }
        return [];
    }

    getCommandSugestions(str: string, callback: Function): void {
        const list: Array<any> = [];
        const channel = Application.getChannel(Application.getSelectedChannel());
        return channel?.fetchCommandList((list_part: CommandList) => {                
            if(list_part.commandPrefix == this.commandCharacter) {
                let currentUserLevel = 0;
                if(channel.vip) currentUserLevel = UserLevel.vip;
                if(channel.moderator) currentUserLevel = UserLevel.moderator;
                if(channel.broadcaster) currentUserLevel = UserLevel.broadcaster;
                for(let cmd of list_part.commands) {
                    if((cmd.command.match(str) || str == "\n") && cmd.userlevel <= currentUserLevel) {
                        list.push({
                            service: list_part.serviceName,
                            // remove prefix if present in provided data and add it manually
                            command: list_part.commandPrefix + cmd.command.replace(list_part.commandPrefix, ""),
                            description: cmd.description
                        });
                    }
                }

                callback(list);
            }
        });
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

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
                position: relative;
            }
            :host([disabled]) {
                pointer-events: none;
                opacity: 0;
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
                padding: 13px 40px 15px 12px;
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

            .flyout {
                display: none;
            }
            :host([command]) .flyout {
                display: block;
                position: absolute;
                bottom: calc(100% - 10px);
                left: 30px;
                right: 30px;
                min-height: 20px;
                padding: 8px;
                background: rgb(20 20 20);
                border-radius: 6px;
                box-shadow: 1px 2px 24px rgb(0 0 0 / 30%);
                border: 1px solid rgb(16 16 16);
                z-index: 100000;
                max-height: 200px;
                overflow: auto;
            }
            :host(:not(:focus-within)) .flyout {
                display: none;
            }

            .command-sugestion {
                border-radius: 4px;
                display: grid;
                grid-template-columns: 1fr auto;
                padding: 8px;
                gap: 4px;
                align-items: center;
                background: rgb(27, 27, 27);
                cursor: pointer;
            }
            .command-sugestion:hover {
                background: rgb(42, 42, 42);
            }
            .command-sugestion:not(:last-child) {
                margin-bottom: 2px;
            }
            .command-name {
                font-size: 14px;
                font-weight: 400;
            }
            .command-service {
                opacity: 0.25;
                font-weight: 400;
                font-size: 12px;
            }
            .command-description {
                opacity: 0.5;
                font-size: 12px;
                grid-column: 1 / span 2;
            }
        `;
    }

    render() {
        const insertCommand = (cmd) => {
            this.value = cmd.command.replace(this.commandCharacter, "");
            this.setCursorPosition(1);
        }
        return html`
            ${this.commandSugestionsList.length == 0 ? "" : html`
                <div class="flyout">
                    ${this.commandSugestionsList.map(cmd => {
                        return html`
                            <div class="command-sugestion" @click="${e => insertCommand(cmd)}">
                                <div class="command-name">${cmd.command}</div>
                                <div class="command-service">${cmd.service}</div>
                                <div class="command-description">${cmd.description}</div>
                            </div>
                        `;
                    })}
                </div>
            `}

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
}

customElements.define('chat-input', ChatInput);