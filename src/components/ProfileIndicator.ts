import { css, html, LitElement } from 'lit-element';
import IRC, { IRCEvents } from '../services/IRC';
import Application from '../App';
import { ChatMessage } from '../MessageParser';
import Events, { on } from '../events/Events';

export default class ProfileIndicator extends LitElement {

    live = false;
    new_message = false;
    channel: string | undefined;

    static get properties() {
        return {
            channel: { type: String },
        };
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);
        
        if(name === "channel" && this.channel) {
            const img = new Image();
            img.width = 24;
            img.alt = this.channel;
            img.setAttribute('loading', '');
    
            this.profileImage = img;
    
            const update_info = async () => {
                setTimeout(() => update_info(), 1000 * 30);

                const channel = Application.getChannel(this.channel);
                if(channel) {
                    const profile_img_url = await channel.getProfileImage();
                    const stream = await channel.getStream();

                    this.live = stream?.type == "live" ? true : false;
        
                    img.src = profile_img_url;
                    img.removeAttribute('loading');
        
                    this.update();
                }
            };
            update_info();
    
            // check if there are new unread messages
            IRC.listen(IRCEvents.ChatMessage, (msg: ChatMessage) => {
                if(msg.channel === this.channel && Application.getSelectedChannel() !== this.channel && 
                    Application.getChats(this.channel).connect) {
                    this.new_message = true;
                    this.update();
                }
            });

            on(Events.ChannelSelected, e => {
                if(e.data.channel === this.channel) {
                    this.new_message = false;
                    this.update();
                }
            })
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
                border: 1px solid white;
                opacity: 0.5;
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
            .profile-icon img[loading] {
                opacity: 0;
            }
        `;
    }

    render() {
        return html`
            <div class="profile-icon" ?live="${this.live}" ?newmessage="${this.new_message}">
                <div class="image">
                    ${this.profileImage}
                </div>
            </div>
        `;
    }
}

customElements.define('profile-indicator', ProfileIndicator);