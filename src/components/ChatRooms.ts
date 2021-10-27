import { css, html, LitElement } from 'lit-element';
import { Application } from '../App';
import ProfileIndicator from './ProfileIndicator';
import AddChannelDialog from './AddChannelDialog';

export default class ChatRooms extends LitElement {

    static get styles() {
        return css`
            :host {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px 0px;
            }
            .icon-list {
                display: grid;
                grid-gap: 15px;
            }
            .room-icon {
                width: 24px;
                height: 24px;
                position: relative;
                cursor: pointer;
            }
            .room-icon:active {
                transform: scale(0.98);
            }
            .room-icon::before {
                content: "";
                transition: transform .2s ease;
                width: 4px;
                height: 8px;
                position: absolute;
                left: -10px;
                top: 50%;
                transform: translate(0, -50%);
                border-radius: 3px;
                z-index: 10000;
                background: #eee;
                transform: translate(-8px, -50%);
            }
            .room-icon[selected]::before {
                transform: translate(0, -50%);
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

    icons = [];

    constructor() {
        super();

        window.addEventListener('selectroom', e => {
            this.update();
        });
        window.addEventListener('addedroom', e => {
            const pfp = new ProfileIndicator(e.room_name);
            this.icons.push(pfp);
            this.update();
        });

        window.addEventListener('closeroom', e => {
            let i = 0;
            for(let icon of this.icons) {
                if(icon.username == e.room_name) {
                    this.icons.splice(i, 1);
                    this.update();
                    return;
                }
                i++;
            }
        });

        window.addEventListener('stateloaded', e => {
            const rooms = Application.getRooms();
            rooms.forEach(room => {
                const pfp = new ProfileIndicator(room);
                this.icons.push(pfp);
            })
            this.update();
        });
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

                <div class="room-icon new-room" @click="${(e) => {
                        const rect = e.target.getClientRects()[0];
                        const ele = new AddChannelDialog(rect.x, rect.y);
                        document.body.append(ele);
                    }}" hint="Join Room" >
                    +
                </div>
            </div>
        `;
    }
}

customElements.define('chat-rooms', ChatRooms);
