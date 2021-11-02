import { css, html, LitElement } from 'lit-element';
import Application from '../App';
import ProfileIndicator from './ProfileIndicator';
import AddChannelDialog from './AddChannelDialog';
import Events, { on } from '../events/Events';

// TODO: Fix drag sorting

export default class ChatRooms extends LitElement {

    icons = [];

    constructor() {
        super();

        on(Events.ChannelSelected, e => {
            this.update();
        });
        on(Events.ChannelRemoved, e => {
            this.update();
        });
        on(Events.Initialize, e => {
            this.update();
        });
        on(Events.ChannelCreated, e => {
            this.update();
        });
    }

    createRenderRoot() {
        return this;
    }

    target: HTMLElement | null = null;

    render() {
        const rooms = Application.getChannels();

        let dragging = false;
        let startY = 0;

        const cancelDrag = (e) => {
            // if(dragging) {
            //     dragging = false;
            //     if(this.target) {
            //         this.target.removeAttribute("dragging");
            //         console.log('cancel');
            //         this.target = null;
            //     }
            // }
        }
        const commitDrag = (e) => {
            // dragging = false;
            // if(this.target) {
            //     this.target.removeAttribute("dragging");
            //     console.log('commit');
            //     this.target = null;
            // }
        }
        const move = (e) => {
            // if(this.target) {
            //     const deltaY = e.y - startY;

            //     if(!dragging && Math.abs(deltaY) > 10) {
            //         dragging = true;
            //         this.target.setAttribute("dragging", "");
            //         moveIcon(this.target, Math.sign(deltaY));
            //     }

            //     if(dragging) {
            //         console.log('darg', deltaY);
            //     }
            // }
        }
        const startDrag = (e) => {
            // this.target = e.target;
            // startY = e.clientY;
            // console.log('start', this.target);
        }

        // move node into direction -1/+1
        const moveIcon = (target: ProfileIndicator, dir: number) => {
            // const parent = target.parentNode as HTMLElement;
            // const iconIndex = [...parent.children].indexOf(target);
            // const d = Math.sign(dir) * (Math.abs(dir) + 1);
            // const newNextNode = parent.children[iconIndex + d];
            // if(newNextNode) {
            //     parent.removeChild(target);
            //     parent.insertBefore(target, newNextNode);

            //     Application.moveRoom(target.channel, iconIndex + dir);
            // }
        }

        return html`
            <div class="icon-list" @pointermove="${move}" @pointerup="${commitDrag}" @pointercancel="${commitDrag}">

                <div channel="@" ?selected="${Application.getSelectedChannel() == "@"}" 
                    class="room-icon mentions-icon" hint="Mentions" 
                    @mousedown="${() => {
                        Application.selectChannel("@");
                    }}">
                    <img src="./images/Mention.svg" width="18px" height="18px"/>
                </div>

                ${rooms.map(room => {
                    return html`
                        <profile-indicator channel="${room}" ?selected="${Application.getSelectedChannel() == room}" 
                            class="room-icon chat-room-icon" hint="${room}" 
                            @mousedown="${() => {
                                Application.selectChannel(room);
                            }}"
                            @pointerdown="${startDrag}">
                        </profile-indicator>
                    `;
                })}

                <div class="room-icon new-room" @click="${(e) => {
                        AddChannelDialog.openOn(e.target, 'right');
                    }}" hint="Join Room" >
                    +
                </div>
            </div>
        `;
    }
}

customElements.define('chat-rooms', ChatRooms);
