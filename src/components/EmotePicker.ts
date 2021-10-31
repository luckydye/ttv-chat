import { css, html } from 'lit-element';
import ContextMenu from "./ContextMenu";
import Emotes from '../services/Emotes';
import { Application } from '../App';

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
                grid-gap: 8px;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                padding: 10px;
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
        `;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        const channel = Application.getChannelId(Application.getSelectedRoom());
        const emotes = Emotes.getChachedChannelEmotes(channel);
        // TODO: Gotta check what sub emotes client can use
        console.log(emotes);
        
        return html`
            <div>EMOTE PICKER</div>
            <div>WOOOWIIEE</div>
            <div class="emote-list">
                ${Object.keys(emotes).map(emote => {
                    return html`<img src="${emotes[emote]}" alt="${emote}" width="48px" height="48px" @click="${() => {
                        const input = document.querySelector('chat-input');
                        input.insert(emote);
                    }}"/>`;
                })}
            </div>
        `;
    }
}

customElements.define('emote-picker', EmotePicker);
