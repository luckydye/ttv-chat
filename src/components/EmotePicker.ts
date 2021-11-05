import TwitchEmotes from './../services/emotes/TwitchEmotes';
import { css, html, TemplateResult } from 'lit-element';
import ContextMenu from "./ContextMenu";
import Emotes from '../services/Emotes';
import Application from '../App';

export default class EmotePicker extends ContextMenu {

    static get styles() {
        return css`
            ${super.styles}
            :host {
                display: block;
                right: 10px !important;
                bottom: 60px;
                top: auto;
                left: auto;
            }
            .emote-list {
                height: 300px;
                width: 350px;
                max-width: calc(100vw - 60px);
                overflow: auto;
                padding: 8px 12px;
            }
            .category {
                display: flex;
                flex-wrap: wrap;
                --grid-gap: 5px;
                margin-right: calc(var(--grid-gap) * -1px);
                padding: 0 4px;
            }
            img {
                object-fit: contain;
                cursor: pointer;
                max-height: 32px;
                margin: 0 var(--grid-gap) var(--grid-gap) 0;
            }
            img:hover {
                background: #333;
                outline: 1px solid #eeeeeebe;
            }
            img:active {
                transform: scale(0.95);
            }

            label {
                display: block;
                font-weight: 300;
                margin: 15px 0 10px 0;
                opacity: 0.5;
                text-transform: capitalize;
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
                line-height: 24px;
                vertical-align: middle;
                position: relative;
                text-align: center;
                cursor: pointer;
                width: 100%;
                user-select: none;
                border-radius: 4px;
                font-size: 12px;
                opacity: 0.5;
            }
            .tab[active] {
                opacity: 1;
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
                opacity: 0.5;
                text-align: center;
            }

            .emote-preview {
                height: 10px;
            }
        `;
    }

    twitch_user_emotes: Array<EmoteSet> = [];

    connectedCallback() {
        super.connectedCallback();

        const channel = Application.getActiveChannel();
        TwitchEmotes.getEmoteSets(channel.emoteSets).then(sets => {
            this.twitch_user_emotes = sets;
            this.update();
        })
    }

    tabSelected = "twitch";

    renderEmoteTab(channel: Channel, tab: string) {
        const twitch_user_emotes = this.twitch_user_emotes;

        if(tab == "twitch") {
            if(twitch_user_emotes.length == 0) {
                return html`<net-loader/>`;
            } else {
                return html`
                    ${twitch_user_emotes.sort((setA, setB) => {
                        // bring current channel emotes to the top
                        return setA.name == channel.channel_name ? 1 : (setB.name == channel.channel_name ? -1 : 0);
                    }).map(set => {
                        const emotes = Object.keys(set.emotes);
                        return emotes.length > 0 ? html`
                            <label>${set.name}</label>
                            <div class="category">
                                ${emotes.map(emote => html`<img 
                                    src="${set.emotes[emote].url_x2}" 
                                    alt="${emote}"
                                    @click="${() => {
                                        const input = document.querySelector('chat-input');
                                        input.insert(emote);
                                    }}"/>`)
                                }
                            </div>
                        ` : ""
                    })}
                `;
            }
        }

        const channel_emotes = Emotes.getChachedChannelEmotes(channel.channel_id);
        const global_emotes = Emotes.global_emotes;

        return html`
            ${channel_emotes[tab] ? html `
                <label>Channel</label>
                <div class="category">
                    ${Object.keys(channel_emotes[tab]).map(emote => html`<img 
                        src="${channel_emotes[tab][emote].url_x2}" 
                        alt="${emote}"
                        @click="${() => {
                            const input = document.querySelector('chat-input');
                            input.insert(emote);
                        }}"/>`)
                    }
                </div>
            ` : ""}
            ${global_emotes[tab] ? html `
                <label>Global</label>
                <div class="category">
                    ${Object.keys(global_emotes[tab]).map(emote => html`<img 
                        src="${global_emotes[tab][emote].url_x2}" 
                        alt="${emote}"
                        @click="${() => {
                            const input = document.querySelector('chat-input');
                            input.insert(emote);
                        }}"/>`)
                    }
                </div>
            ` : ""}
        `;
    }

    selectTab(tab: string) {
        this.tabSelected = tab;
        this.update();
    }

    render() {
        const channel = Application.getActiveChannel();
        const emoteTab = this.renderEmoteTab(channel, this.tabSelected);

        return html`
            <div class="tabs">
                <div class="tab" ?active="${this.tabSelected == "twitch"}" tab-id="twitch" 
                    @click="${e => this.selectTab(e.target.getAttribute("tab-id"))}">Twitch</div>
                <div class="tab" ?active="${this.tabSelected == "bttv"}" tab-id="bttv" 
                    @click="${e => this.selectTab(e.target.getAttribute("tab-id"))}">BTTV</div>
                <div class="tab" ?active="${this.tabSelected == "ffz"}" tab-id="ffz" 
                    @click="${e => this.selectTab(e.target.getAttribute("tab-id"))}">FFZ</div>
                <div class="tab" ?active="${this.tabSelected == "7tv"}" tab-id="7tv" 
                    @click="${e => this.selectTab(e.target.getAttribute("tab-id"))}">7TV</div>
            </div>

            <div class="emote-list">
                ${emoteTab}
            </div>

            <div class="emote-preview">
                
            </div>
        `;
    }
}

customElements.define('emote-picker', EmotePicker);
