import { css, html, LitElement } from "lit";
import Application from "../App";
import ContextMenu from "./ContextMenu";

export default class AddChannelDialog extends ContextMenu {
  static get styles() {
    return css`
      ${super.styles}
      .select-action {
        box-sizing: border-box;
        padding: 6px 8px;
        border-radius: 4px;
        background: #2f2f32;
        color: white;
        min-width: 180px;
        outline: none;
        border: none;
        margin-bottom: 10px;
      }
      input {
        box-sizing: border-box;
        padding: 6px 8px;
        border-radius: 4px;
        background: #101010;
        color: white;
        min-width: 180px;
        outline: none;
        border: none;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      this.shadowRoot.querySelector("input")?.focus();
    }, 1);
  }

  submit(e) {
    Application.createChannel(e.target.value.toLocaleLowerCase());
    this.remove();
  }

  render() {
    return html`
      <div>
        <select class="select-action">
          <option>Add Channel</option>
        </select>
        <br />
        <input
          placeholder="username"
          @keyup="${(e) => {
            if (e.key == "Enter") {
              this.submit(e);
            }
          }}"
        />
      </div>
    `;
  }
}

customElements.define("add-channel-dialog", AddChannelDialog);
