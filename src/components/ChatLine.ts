import { css, html, LitElement } from "lit";
import { ChatInfoMessage } from "./MessageParser";

export class ChatInfo extends LitElement {
  message: ChatInfoMessage;

  constructor(msg: ChatInfoMessage) {
    super();

    this.message = msg;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: #211b25;
        padding: 8px 15px;
        margin: 2px 0;
        line-height: 1.33em;
      }
      .message {
        display: inline;
      }
    `;
  }

  render() {
    return this.message.content;
  }
}

export class ChatNote extends LitElement {
  message: string = "";

  constructor(msg: string) {
    super();

    this.message = msg;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: #0c0c0c;
        padding: 8px 15px;
        margin: 2px 0;
        opacity: 0.5;
        line-height: 1.33em;
      }
      .message {
        display: inline-flex;
      }
      img {
        margin: 0 4px;
      }
    `;
  }

  render() {
    if (this.message) {
      return html`
        <div class="line">
          <div class="message">${this.message}</div>
        </div>
      `;
    }
  }
}

customElements.define("chat-info", ChatInfo);
customElements.define("chat-note", ChatNote);
