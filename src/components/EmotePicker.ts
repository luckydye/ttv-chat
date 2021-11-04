import { css, html } from 'lit-element';
import ContextMenu from "./ContextMenu";
import Emotes from '../services/Emotes';
import Application from '../App';

export default class EmotePicker extends ContextMenu {

    static get styles() {
        return css`
            ${super.styles}
            :host {
                display: block;
                right: 20px !important;
                bottom: 60px;
                top: auto;
                left: auto;
            }
            .emote-list {
                min-height: 200px;
                max-height: 200px;
                width: 350px;
                max-width: calc(100vw - 60px);
                overflow: auto;
                padding: 8px 12px;
            }
            .category {
                grid-gap: 2px;
                display: grid;
                grid-template-columns: repeat(10, 1fr);
            }
            img {
                object-fit: contain;
                cursor: pointer;
                width: 100%;
            }
            img:hover {
                background: #333;
            }
            img:active {
                transform: scale(0.95);
            }

            label {
                display: block;
                font-weight: 300;
                margin: 15px 0 10px 0;
                opacity: 0.5;
            }
            label:first-child {
                margin-top: 0;
            }

            .tabs {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                justify-content: center;
                justify-items: center;
                grid-gap: 12px;
                padding: 4px 12px 8px 12px;
            }

            .tab {
                line-height: 32px;
                vertical-align: middle;
                position: relative;
                text-align: center;
                cursor: pointer;
                width: 100%;
                user-select: none;
                border-radius: 4px;
                font-size: 12px;
            }
            .tab[active]::after {
                opacity: 1;
            }
            .tab:hover {
                background: #ffffff08;
            }
            .tab:active {
                background: #ffffff14;
            }
            .tab::after {
                content: "";
                display: block;
                bottom: 0px;
                left: 50%;
                width: 100%;
                height: 2px;
                background: grey;
                opacity: 0.2;
                text-align: center;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    tabSelected = "twitch";

    render() {
        const channel = Application.getSelectedChannel();
        const ch = Application.getChannel(channel);
        const channel_emotes = Emotes.getChachedChannelEmotes(ch.channel_id);
        const global_emotes = Emotes.global_emotes;
        // TODO: Gotta check what sub emotes client can use

        const selectTab = (tab: string) => {
            this.tabSelected = tab;
            this.update();
        }
        
        return html`
            
            <div class="tabs">
                <div class="tab" ?active="${this.tabSelected == "twitch"}" tab-id="twitch" 
                    @click="${e => selectTab(e.target.getAttribute("tab-id"))}">Twitch</div>
                <div class="tab" ?active="${this.tabSelected == "bttv"}" tab-id="bttv" 
                    @click="${e => selectTab(e.target.getAttribute("tab-id"))}">BTTV</div>
                <div class="tab" ?active="${this.tabSelected == "ffz"}" tab-id="ffz" 
                    @click="${e => selectTab(e.target.getAttribute("tab-id"))}">FFZ</div>
                <div class="tab" ?active="${this.tabSelected == "7tv"}" tab-id="7tv" 
                    @click="${e => selectTab(e.target.getAttribute("tab-id"))}">7TV</div>
            </div>

            <div class="emote-list">
                ${channel_emotes[this.tabSelected] ? html `
                    <label>Channel</label>
                    <div class="category">
                        ${Object.keys(channel_emotes[this.tabSelected]).map(emote => html`<img 
                            src="${channel_emotes[this.tabSelected][emote].url_x2}" 
                            alt="${emote}"
                            @load="${(e) => {
                                if(e.target.width > e.target.height * 2) {
                                    e.target.style = "grid-column: span 3;";
                                }
                            }}"
                            @click="${() => {
                                const input = document.querySelector('chat-input');
                                input.insert(emote);
                            }}"/>`)
                        }
                    </div>
                ` : ""}
                ${global_emotes[this.tabSelected] ? html `
                    <label>Global</label>
                    <div class="category">
                        ${Object.keys(global_emotes[this.tabSelected]).map(emote => html`<img 
                            src="${global_emotes[this.tabSelected][emote].url_x2}" 
                            alt="${emote}"
                            @load="${(e) => {
                                if(e.target.width > e.target.height * 2) {
                                    e.target.style = "grid-column: span 3;";
                                }
                            }}"
                            @click="${() => {
                                const input = document.querySelector('chat-input');
                                input.insert(emote);
                            }}"/>`)
                        }
                    </div>
                ` : ""}
            </div>
        `;
    }
}

customElements.define('emote-picker', EmotePicker);
