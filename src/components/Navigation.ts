import { css, html, LitElement } from 'lit-element';

export default class ChatInput extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
            }
        `;
    }

    constructor() {
        super();

    }

    render() {
        return html`
            <div class="wrapper">
                
            </div>
        `;
    }
}

customElements.define('navigation-bar', ChatInput);
