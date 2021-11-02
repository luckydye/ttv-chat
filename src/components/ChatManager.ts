import { css, html, LitElement } from 'lit-element';

export default class ChatManager extends LitElement {

    // listen for channel created events, custom events carrying the Channel object.
    
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

customElements.define('chat-manager', ChatManager);