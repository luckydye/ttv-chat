import { css, html, LitElement } from 'lit-element';
import IRC, { IRCEvents } from '../services/IRC';
import Application from '../App';
import { UserMessage } from '../MessageParser';
import Events, { on } from '../events/Events';

export default class ProfileIndicator extends LitElement {

    live = false;
    new_message = false;
    tagged = false;
    channel: string;

    profile_image_url: string | undefined;

    static get properties() {
        return {
            channel: { type: String },
        };
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);

        if (name === "channel" && this.channel) {
            // check if there are new unread messages
            IRC.listen(IRCEvents.ChatMessage, (msg: UserMessage) => {
                if (msg.channel === this.channel && Application.getSelectedChannel() !== this.channel &&
                    Application.getChannel(this.channel)?.chat_connected) {
                    this.new_message = true;
                    this.update();
                }
            });

            on(Events.ChatMessageEvent, e => {
                if (e.data.channel === this.channel && Application.getSelectedChannel() !== this.channel &&
                    Application.getChannel(this.channel)?.chat_connected) {
                    this.new_message = true;

                    if(e.data.message.tagged) {
                        this.tagged = true;
                    }

                    this.update();
                }
            });

            on(Events.ChannelSelected, e => {
                if (e.data.channel === this.channel) {
                    this.new_message = false;
                    this.tagged = false;
                    this.update();
                }
            });

            on(Events.ChannelInfoChanged, async e => {
                const channel = e.data.channel;
                if (channel.channel_login === this.channel) {

                    this.live = channel.is_live;
                    this.profile_image_url = channel.profile_image_url;

                    this.update();
                }
            });
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .profile-icon {
                position: relative;
            }
            .profile-icon[live]::after {
                content: "";
                position: absolute;
                bottom: -5px;
                right: -5px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                overflow: hidden;
                background: rgb(225 43 43);
                border: 2px solid rgb(31, 31, 35);
            }
            .profile-icon[newmessage] {
                transition: all .2s ease;
            }
            @keyframes appear {
                0% { transform: scale(0.75) }
                75% { transform: scale(1.02) }
                100% { transform: scale(1.0) }
            }
            .profile-icon[newmessage]::before {
                animation: appear .2s ease;
                content: "";
                position: absolute; 
                top: -3px;
                right: -3px;
                width: calc(100% + 4px);
                height: calc(100% + 4px);
                border-radius: 50%;
                background: #1f1f23;
                z-index: -1;
                border: 1px solid #858585;
            }
            .profile-icon[tagged]::before {
                border-color: hsl(0deg 97% 60%);
            }
            .profile-icon .image {
                overflow: hidden;
                border-radius: 50%;
                background: #333333;
                box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.25);
            }
            .profile-icon img {
                width: 25px;
                height: 25px;
                display: block;
                pointer-events: none;
            }
            .profile-icon img[empty] {
                opacity: 0;
            }
        `;
    }

    render() {
        return html`
            <div class="profile-icon" ?live="${this.live}" ?tagged="${this.tagged}" ?newmessage="${this.new_message}">
                <div class="image">
                    <img ?empty="${!this.profile_image_url}" width="24px" src="${this.profile_image_url || ''}" alt="${this.channel}" />
                </div>
            </div>
        `;
    }
}

customElements.define('profile-indicator', ProfileIndicator);