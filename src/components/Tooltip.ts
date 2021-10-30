import { css, html, LitElement } from 'lit-element';

export default class PageOverlay extends LitElement {

    static get styles() {
        return css`
            :host {
                --x: 0;
                --y: 0;

                display: block;
                padding: 8px;
                background: #000000b5;
                border-radius: 6px;
                text-align: center;
                backdrop-filter: blur(6px);
                text-transform: capitalize;
                font-size: 12px;

                position: fixed;
                left: calc(var(--x) * 1px);
                top: calc(var(--y) * 1px);
                pointer-events: none;

                transform: translate(5px, calc(-100% - 5px));
            }
        `;
    }

    x: number = 0;
    y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;
    }

    setPosition(x: number = this.x, y: number = this.y) {
        this.x = x;
        this.y = y;
        this.style.setProperty('--x', this.x.toString());
        this.style.setProperty('--y', this.y.toString());
    }

    connectedCallback() {
        super.connectedCallback();
        this.setPosition();
    }

    render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('page-overlay', PageOverlay);

let lastTarget: EventTarget | null = null;
let lastOverlay: PageOverlay | null = null;

function createOverlayForImageElement(e: PointerEvent) {
    const target = e.target;
    const overlay = new PageOverlay(e.x, e.y);
    overlay.innerHTML = `
        <img src="${target.src}" />
        <div>${target.alt}</div>
    `;
    document.body.append(overlay);
    return overlay;
}

window.addEventListener('pointermove', e => {
    const target = e.target;

    if(lastOverlay != null) {
        lastOverlay.setPosition(e.x, e.y);
    }

    if(target !== lastTarget) {
        // remove old tooltip
        lastTarget = null;
        if(lastOverlay) {
            lastOverlay.remove();
            lastOverlay = null;
        }

        if(target && (target as HTMLImageElement).classList.contains('badge')) {
            lastOverlay = createOverlayForImageElement(e);
            lastTarget = target;
        }

        if(target && (target as HTMLImageElement).classList.contains('emote')) {
            lastOverlay = createOverlayForImageElement(e);
            lastTarget = target;
        }

        if(target && (target as HTMLImageElement).classList.contains('inline-link')) {
            // inline link preview
            // lastOverlay = createOverlayForImageElement(e);
            lastTarget = target;
        }
    }

    
})