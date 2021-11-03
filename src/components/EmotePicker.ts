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
            }
            .emote-list {
                max-height: 300px;
                overflow: auto;
                padding: 10px;
            }
            .category {
                grid-gap: 8px;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
            }
            img {
                object-fit: contain;
                cursor: pointer;
            }
            img:hover {
                background: #333;
            }
            img:active {
                transform: scale(0.95);
            }

            label {
                display: block;
                font-weight: bold;
                margin: 14px 0 8px 0;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        const channel = Application.getSelectedChannel();
        const ch = Application.getChannel(channel);
        const emotes = Emotes.getChachedChannelEmotes(ch.channel_id);
        // TODO: Gotta check what sub emotes client can use
        
        return html`
            <div>EMOTE PICKER</div>
            <div>WOOOWIIEE</div>
            <div class="emote-list">
                ${emotes["twitch"] ? html `
                    <label>Twitch</label>
                    <div class="category">
                        ${Object.keys(emotes["twitch"]).map(emote => {
                            return html`<img src="${emotes["twitch"][emote].url_x2}" alt="${emote}" width="48px" height="48px" @click="${() => {
                                const input = document.querySelector('chat-input');
                                input.insert(emote);
                            }}"/>`;
                        })}
                    </div>
                ` : ""}
                ${emotes["bttv"] ? html `
                    <label>BTTV</label>
                    <div class="category">
                        ${Object.keys(emotes["bttv"]).map(emote => {
                            return html`<img src="${emotes["bttv"][emote].url_x2}" alt="${emote}" width="48px" height="48px" @click="${() => {
                                const input = document.querySelector('chat-input');
                                input.insert(emote);
                            }}"/>`;
                        })}
                    </div>
                ` : ""}
                ${emotes["ffz"] ? html `
                    <label>FFZ</label>
                    <div class="category">
                        ${Object.keys(emotes["ffz"]).map(emote => {
                            return html`<img src="${emotes["ffz"][emote].url_x2}" alt="${emote}" width="48px" height="48px" @click="${() => {
                                const input = document.querySelector('chat-input');
                                input.insert(emote);
                            }}"/>`;
                        })}
                    </div>
                ` : ""}
                ${emotes["7tv"] ? html `
                    <label>7TV</label>
                    <div class="category">
                        ${Object.keys(emotes["7tv"]).map(emote => {
                            return html`<img src="${emotes["7tv"][emote].url_x2}" alt="${emote}" width="48px" height="48px" @click="${() => {
                                const input = document.querySelector('chat-input');
                                input.insert(emote);
                            }}"/>`;
                        })}
                    </div>
                ` : ""}
            </div>
        `;
    }
}

customElements.define('emote-picker', EmotePicker);
