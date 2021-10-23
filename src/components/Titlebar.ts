import { appWindow } from '@tauri-apps/api/window';
import { css, html, LitElement } from 'lit-element';

export default class Titlebar extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .window-title {
                padding: 0 10px;
            }
            .titlebar {
                height: 30px;
                background: #329ea3;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
            }

            .titlebar-button {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
            }

            .titlebar-button:hover {
                background: #5bbec3;
            }
        `;
    }

    render() {
        return html`
            <div class="titlebar">
                <div class="window-title">${document.title}</div>
                <div>
                    <div class="titlebar-button" @click="${() => appWindow.minimize()}">
                        <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
                    </div>
                    <div class="titlebar-button" @click="${() => appWindow.toggleMaximize()}">
                        <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
                    </div>
                    <div class="titlebar-button" @click="${() => appWindow.close()}">
                        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('tauri-titlebar', Titlebar);