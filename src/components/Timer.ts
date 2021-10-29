import { css, html, LitElement } from 'lit-element';

export default class Tiemr extends LitElement {

    static get properties() {
        return {
            starttime: Number,
            updateRate: Number
        };
    }

    starttime: number;
    updateRate: number = 1;

    constructor() {
        super();

        setInterval(() => {
            this.update();
        }, 1000 * this.updateRate);
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
            }
        `;
    }

    render() {
        const uptimems = Date.now() - new Date(this.starttime).valueOf();
        const uptime = {
            hours: Math.floor(uptimems / 1000 / 60 / 60),
            minutes: Math.floor((uptimems / 1000 / 60) % 60),
            seconds: Math.floor((uptimems / 1000) % 60),
        }
        return html`
            <span>${`${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`}</span>
        `;
    }
}

customElements.define('stream-timer', Tiemr);