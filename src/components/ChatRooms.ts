import { css, html, LitElement } from 'lit-element';
import { Application } from '../App';
import { getUserInfo } from '../services/Twitch';
import ProfileIndicator from './ProfileIndicator';

export default class ChatRooms extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px 0;
            }
            .icon-list {
                display: grid;
                grid-gap: 10px;
            }
            .room-icon {
                width: 24px;
                height: 24px;
                position: relative;
                cursor: pointer;
            }
            .room-icon[selected]::before {
                content: "";
                width: 5px;
                position: absolute;
                right: calc(100% + 5px);
                top: 50%;
                transform: translate(0, -50%);
                padding: 4px 8px;
                border-radius: 3px;
                z-index: 10000;
                background: #eee;
            }
            .room-icon[hint]:hover::after {
                content: attr(hint);
                position: absolute;
                left: calc(100% + 5px);
                top: 50%;
                transform: translate(0, -50%);
                padding: 4px 8px;
                border-radius: 3px;
                z-index: 10000;
                background: rgb(0 0 0 / 50%);
                backdrop-filter: blur(4px);
                width: max-content;
            }
            .new-room {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #333333;
                border-radius: 50px;
                width: 25px;
                height: 25px;
                line-height: 100%;
                margin-top: 5px;
            }
        `;
    }

    constructor() {
        super();
        
        window.addEventListener('selectroom', e => {
            this.update();
        });

        this.icons = [];

        const rooms = Application.getRooms();
        rooms.forEach(room => {
            const selected = Application.getSelectedRoom() == room;
            const pfp = new ProfileIndicator(room);

            this.icons.push(pfp);
        })
    }

    render() {
        return html`
            <div class="icon-list">
                ${this.icons.map(icon => {
                    return html`
                        <div ?selected="${Application.getSelectedRoom() == icon.username}" 
                            class="room-icon" hint="${icon.username}" 
                            @click="${() => {
                                Application.selectRoom(icon.username);
                            }}">
                            ${icon}
                        </div>
                    `;
                })}

                <div class="room-icon new-room" @click="${() => {
                        // Application.addRoomDialog();
                    }}" hint="Join Room" >
                    +
                </div>
            </div>
        `;
    }
}

customElements.define('chat-rooms', ChatRooms);
