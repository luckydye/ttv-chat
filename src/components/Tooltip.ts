import PageOverlay from './PageOverlay';
import LinkPreview from './LinkPreview';
import { render } from 'lit-html';
import './Loader';

let lastTarget: EventTarget | null = null;
let lastOverlay: PageOverlay | null = null;

function createOverlayForImageElement(e: PointerEvent) {
    const target = e.target as HTMLImageElement;
    const overlay = new PageOverlay(e.x, e.y);
    const service = target.getAttribute('service');
    overlay.innerHTML = `
        <img src="${target.src}" />
        <div style="margin-top: 5px;">${target.alt}</div>
        ${service ? `<div style="margin-top: 2px; opacity: 0.5;">${service}</div>` : ""}
    `;
    document.body.append(overlay);
    return overlay;
}

let linkOverlayTimeout: any;

function createOverlayForLink(e: PointerEvent) {
    const target = e.target as HTMLLinkElement;
    const overlay = new PageOverlay(e.x, e.y);
    overlay.innerHTML = `<net-loader></net-loader>`;

    clearTimeout(linkOverlayTimeout);
    linkOverlayTimeout = setTimeout(() => {
        LinkPreview.generate(target.innerText).then(data => {
            render(data, overlay);
        })
    }, 200);
    
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

        if(target && (target as HTMLImageElement).hasAttribute('emote')) {
            lastOverlay = createOverlayForImageElement(e);
            lastTarget = target;
        }

        if(target && (target as HTMLImageElement).classList.contains('badge')) {
            lastOverlay = createOverlayForImageElement(e);
            lastTarget = target;
        }

        if(target && (target as HTMLImageElement).classList.contains('inline-link')) {
            // inline link preview
            lastOverlay = createOverlayForLink(e);
            lastTarget = target;
        }
    }

    
})