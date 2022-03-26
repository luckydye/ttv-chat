import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import State from "../State";
import StateElement from "../types/StateElement";

// This is a adapter element, that connects scoped dom elements
// to the internal application states using DOM events.

@customElement("app-state")
export default class AppState extends LitElement {
  /**
   * state key comes from the target element attributes
   *  or this app states attributes as fallback
   */
  @property({ type: String })
  key?: string;

  /**
   * Event root scope
   */
  @property({ type: String, reflect: true })
  scope?: string;

  _removeStateUpdateHandler?: () => void;

  connectedCallback(): void {
    // handle any change event
    this.addEventListener("change", this.handleEvent as EventListener);
    // handle any input event
    this.addEventListener("input", this.handleEvent as EventListener);

    // on external state updates
    //  set "value" attribute of children with a "state-key" attribute
    this._removeStateUpdateHandler = State.onState(this.scope, (data) => {
      for (const key in data) {
        const eles = this.querySelectorAll(
          `[state-key="${key}"]`
        ) as NodeListOf<StateElement>;

        for (const ele of eles) {
          ele.value = data[key];
        }
      }
    });
  }

  disconnectedCallback(): void {
    this.removeEventListener("change", this.handleEvent as EventListener);
    this.removeEventListener("input", this.handleEvent as EventListener);

    if (this._removeStateUpdateHandler) {
      this._removeStateUpdateHandler();
    }
  }

  /**
   * Handle input events from elements
   *  Uses "state-key" and "state-id" of target element.
   *  As fallback use the "state-key" attribute from this app-state element.
   */
  handleEvent(e: CustomEvent) {
    const target = e.target as HTMLInputElement;

    if (!this.scope) return;

    if (target.hasAttribute("state-key")) {
      const key: string = target.getAttribute("state-key") || this.key;
      const stateValue =
        e.detail?.value != null ? e.detail?.value : target.value;

      if (target.hasAttribute("state-id")) {
        const id: string = target.getAttribute("state-id");

        // set the value of a named state inside a scope
        const state = State.getState(this.scope)[key];
        state[id] = stateValue;
        State.setState(this.scope, {
          [key]: state,
        });
        e.cancelBubble = true;
      } else {
        // set root state value of a scope
        State.setState(this.scope, {
          [key]: stateValue,
        });
        e.cancelBubble = true;
      }
    }
  }
}
