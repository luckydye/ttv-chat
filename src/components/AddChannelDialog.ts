import { css, html, LitElement } from 'lit-element';

export default class AddChannelDialog extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        
    }

    render() {
        return html`
            <div></div>
        `;
    }
}

customElements.define('add-channel-dialog', AddChannelDialog);
