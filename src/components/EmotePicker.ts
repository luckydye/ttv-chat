import { css, html } from 'lit-element';
import ContextMenu from "./ContextMenu";

export default class EmotePicker extends ContextMenu {

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    constructor() {
        super();

    }

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return html`
            <div></div>
        `;
    }
}

customElements.define('emote-picker', EmotePicker);
