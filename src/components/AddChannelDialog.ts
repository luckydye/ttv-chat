import { css, html, LitElement } from 'lit-element';
import { Application } from '../App';

export default class AddChannelDialog extends LitElement {

    static get styles() {
        return css`
            @keyframes slide-in {
                from {
                    opacity: 0;
                    transform: translate(-10px, 0);
                }
            }
            :host {
                animation: slide-in .2s ease;
                display: block;
                position: fixed;
                top: calc(var(--y, 0) * 1px - 10px);
                left: calc(var(--x, 0) * 1px + 40px);
                z-index: 10000000;
                padding: 10px;
                border-radius: 6px;
                box-shadow: rgb(0 0 0 / 20%) 1px 2px 12px;
                background: #1f1f23f0;
                backdrop-filter: blur(8px);
            }
            .select-action {
                box-sizing: border-box;
                padding: 6px 8px;
                border-radius: 4px;
                background: #2F2F32;
                color: white;
                min-width: 180px;
                outline: none;
                border: none;
                margin-bottom: 10px;
            }
            input {
                box-sizing: border-box;
                padding: 6px 8px;
                border-radius: 4px;
                background: #101010;
                color: white;
                min-width: 180px;
                outline: none;
                border: none;
            }
        `;
    }

    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
    }

    connectedCallback() {
        super.connectedCallback();

        this.style.setProperty('--x', this.x.toString());
        this.style.setProperty('--y', this.y.toString());
        this.tabIndex = 0;

        this.addEventListener('blur', e => {
            this.remove();
        })

        setTimeout(() => {
            this.shadowRoot.querySelector('input')?.focus();
        }, 1);
    }

    submit(e) {
        Application.addRoom(e.target.value);
        this.remove();
    }

    render() {
        return html`
            <div>
                <select class="select-action">
                    <option>Add Channel</option>
                </select>
                <br/>
                <input placeholder="username" @keyup="${(e) => {
                    if(e.key == "Enter") {
                        this.submit(e);
                    }
                }}" />
            </div>
        `;
    }
}

customElements.define('add-channel-dialog', AddChannelDialog);
