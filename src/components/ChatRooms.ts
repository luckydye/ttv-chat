import { css, html, LitElement } from 'lit-element';
import { Application } from '../App';
import ProfileIndicator from './ProfileIndicator';
import AddChannelDialog from './AddChannelDialog';

// TODO: Fix drag sorting

export default class ChatRooms extends LitElement {

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
            this.update();
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

    createRenderRoot() {
        return this;
    }

    target: HTMLElement | null = null;

    render() {
        const rooms = Application.getRooms();

        let dragging = false;
        let startY = 0;

        const cancelDrag = (e) => {
            if(dragging) {
                dragging = false;
                if(this.target) {
                    this.target.removeAttribute("dragging");
                    console.log('cancel');
                    this.target = null;
                }
            }
        }
        const commitDrag = (e) => {
            dragging = false;
            if(this.target) {
                this.target.removeAttribute("dragging");
                console.log('commit');
                this.target = null;
            }
        }
        const move = (e) => {
            if(this.target) {
                const deltaY = e.y - startY;

                if(!dragging && Math.abs(deltaY) > 10) {
                    dragging = true;
                    this.target.setAttribute("dragging", "");
                    moveIcon(this.target, Math.sign(deltaY));
                }

                if(dragging) {
                    console.log('darg', deltaY);
                }
            }
        }
        const startDrag = (e) => {
            this.target = e.target;
            startY = e.clientY;
            console.log('start', this.target);
        }

        // move node into direction -1/+1
        const moveIcon = (target: ProfileIndicator, dir: number) => {
            const parent = target.parentNode as HTMLElement;
            const iconIndex = [...parent.children].indexOf(target);
            const d = Math.sign(dir) * (Math.abs(dir) + 1);
            const newNextNode = parent.children[iconIndex + d];
            if(newNextNode) {
                parent.removeChild(target);
                parent.insertBefore(target, newNextNode);

                Application.moveRoom(target.channel, iconIndex + dir);
            }
        }

        return html`
            <div class="icon-list" @pointermove="${move}" @pointerup="${commitDrag}" @pointercancel="${commitDrag}">

                <div channel="@" ?selected="${Application.getSelectedRoom() == "@"}" 
                    class="room-icon mentions-icon" hint="Mentions" 
                    @mousedown="${() => {
                        Application.selectRoom("@");
                    }}">
                    <img src="./images/Mention.svg" width="18px" height="18px"/>
                </div>

                ${rooms.map(room => {
                    return html`
                        <profile-indicator channel="${room}" ?selected="${Application.getSelectedRoom() == room}" 
                            class="room-icon chat-room-icon" hint="${room}" 
                            @mousedown="${() => {
                                Application.selectRoom(room);
                            }}"
                            @pointerdown="${startDrag}">
                        </profile-indicator>
                    `;
                })}

                <div class="room-icon new-room" @click="${(e) => {
                        AddChannelDialog.openOn(e.target);
                    }}" hint="Join Room" >
                    +
                </div>
            </div>
        `;
    }
}

customElements.define('chat-rooms', ChatRooms);
