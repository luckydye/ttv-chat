import { css, html, LitElement } from 'lit-element';

export default class ContextMenu extends LitElement {

    static get styles() {
        return css`
            @keyframes slide-in {
                from {
                    opacity: 0;
                    transform: translate(-10px, 0);
                }
            }
            :host {
                outline: none;
                animation: slide-in .2s ease;
                display: block;
                position: fixed;
                top: calc(var(--y, 0) * 1px - 10px);
                left: calc(var(--x, 0) * 1px + 40px);
                z-index: 10000000;
                padding: 5px;
                border-radius: 6px;
                box-shadow: rgb(0 0 0 / 25%) 1px 2px 8px;
                border: 1px solid rgb(48, 48, 48);
                background: rgba(31, 31, 35, 0.94);
                backdrop-filter: blur(12px);
            }
        `;
    }

    static openOn(ele: HTMLElement) {
        const rect = ele.getClientRects()[0];
        const newEle = new this(rect.x, rect.y);
        document.body.append(newEle);
        return newEle;
    }

    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        this.addEventListener('blur', e => {
            setTimeout(() => {
                // check if any inner element has the focus
                this.close();
            }, 150);
        })
    }

    close() {
        this.remove();
    }

    connectedCallback() {
        super.connectedCallback();

        this.style.setProperty('--x', this.x.toString());
        this.style.setProperty('--y', this.y.toString());
        this.tabIndex = 0;

        this.focus();
    }

    render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('context-menu', ContextMenu);
