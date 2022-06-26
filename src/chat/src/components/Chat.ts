import { css, html, LitElement, TemplateResult } from "lit";
import { ChatInfoMessage, ChatMessage } from "./MessageParser";
import { ChatInfo, ChatNote } from "./ChatLine";
import { render } from "lit-html";
import AnimatedScroll from "./AnimatedScroll";
// Components
import "./FluidInput";
import "./Timer";
import "./UserList";

// TODO: make custom scrollbar for scrolllock handling

// TODO: potential performance moon shot: Virtualize message history and dynamicly render the messages that will be visible soon.
//          Will require virtual scrolling mechanism (at least the scrollbar)

//          Batch render the messages that could be visible in a single scroll.

export default class Chat extends LitElement {
	static get properties() {
		return {
			hidden: { type: Boolean },
		};
	}

	MAX_BUFFER_SIZE = 200;

	channel: string = "";

	bookmark: HTMLElement;

	scrollLock = true;
	chatHeight: number = 0;
	scrollElement: HTMLElement | null;

	init = false;
	moderator = false;

	cancelLastScrollAnimation: Function | null = null;

	lastMessage: ChatMessage | null = null;

	cancelAnimation() {
		if (this.cancelLastScrollAnimation) {
			this.cancelLastScrollAnimation();
		}
	}

	appendMessage(msg: ChatMessage) {
		let followup = false;
		if (this.lastMessage && this.lastMessage.user_name == msg.user_name) {
			followup = true;
		}

		const ele = msg.content(this.moderator);
		if (ele) {
			if (followup) {
				ele.setAttribute("followup", "");
			}
			const line = this.insertAdjacentElement("beforeend", ele);
			this.afterAppend();
			this.lastMessage = msg;
			return line;
		}
	}

	appendInfo(msg: ChatInfoMessage) {
		const line = new ChatInfo(msg);
		this.insertAdjacentElement("beforeend", line);
		this.afterAppend();
	}

	appendNote(text: string | TemplateResult) {
		const line = new ChatNote(text);
		this.insertAdjacentElement("beforeend", line);
		this.afterAppend();
	}

	appendTimestamp(ts: Date) {
		this.appendNote(
			html`
				<div class="timestamp">
					${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}
				</div>
			`
		);
	}

	setRoom(channel: string) {
		this.channel = channel;
		this.requestUpdate();
		this.setAttribute("name", this.channel);
	}

	placeBookmarkLine() {
		if (this.bookmark) {
			this.removeBookmarkLine();
		}
		const line = document.createElement("div");
		line.className = "bookmark";
		this.appendChild(line);
		this.bookmark = line;
	}

	removeBookmarkLine() {
		if (this.bookmark) {
			this.bookmark.remove();
		}
	}

	constructor() {
		super();

		window.addEventListener("resize", (e) => {
			this.chatHeight = this.clientHeight;
		});
	}

	connectedCallback() {
		super.connectedCallback();

		this.chatHeight = this.clientHeight;
		this.show();
	}

	onScroll(e: any) {
		if (!this.scrollLock) {
			if (this.scrollElement.scrollTop >= this.lowestScrollX) {
				this.lock();
			}
		}
	}

	onWheel(e: any) {
		const dir = e.deltaY;
		if (dir < 0 && this.scrollLock) {
			this.cancelAnimation();
			this.unlock();
		}
	}

	lock() {
		this.scrollLock = true;
		this.setAttribute("locked", "");
	}

	unlock() {
		this.scrollLock = false;
		this.removeAttribute("locked");
		this.placeBookmarkLine();
	}

	show() {
		this.removeAttribute("hidden");

		requestAnimationFrame(() => {
			// anim frame to wait for the element to be drawn

			this.chatHeight = this.clientHeight;
			this.scrollElement = this.shadowRoot.querySelector(".lines");
			if (!this.init) {
				this.scrollElement.addEventListener("wheel", (e) => this.onWheel(e));
				this.init = true;
			}

			this.scrollToLatest();
			this.lock();
		});
	}

	hide() {
		this.setAttribute("hidden", "");
	}

	get lowestScrollX() {
		return (this.scrollElement?.scrollHeight || 0) - this.chatHeight;
	}

	scrollToLatest() {
		if (this.hasAttribute("hidden")) {
			// dont animaate scroll if chat is not in view.
			// if it tries to animate, it may block the active chat from correctly animate scrolling to the latest position.
			return;
		}

		if (this.scrollElement) {
			// this.scrollElement.scrollTo(0, this.lowestScrollX);
			AnimatedScroll.scrollTo(this.lowestScrollX, this.scrollElement);
		}

		this.lock();
	}

	afterAppend() {
		// clean out buffer
		if (this.children.length > this.MAX_BUFFER_SIZE + 20) {
			const rest = this.children.length - this.MAX_BUFFER_SIZE;
			for (let i = 0; i < rest; i++) {
				this.children[i].remove();
			}
		}

		// update scroll position
		if (this.scrollLock) {
			requestAnimationFrame(() => {
				this.scrollToLatest();
			});
		}
	}

	render() {
		return html`
			<div class="chat-actions">
				<div></div>
				<div class="chat-channel-name">${this.channel}</div>
				<div class="chat-state-icons"></div>
			</div>
			<div class="scroll-to-bottom" @click="${() => this.scrollToLatest()}">
				<span>Scroll to the bottom</span>
			</div>
			<div class="lines" @scroll="${(e) => this.onScroll(e)}">
				<slot></slot>
			</div>
		`;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				height: 100%;
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			.header {
				background: rgba(25, 25, 28, 0.75);
				backdrop-filter: blur(24px);
				background: rgba(25, 25, 28, 0.9);
				backdrop-filter: blur(24px);
				position: relative;
				z-index: 1000;
				border-bottom: 1px solid black;
			}

			.lines {
				backface-visibility: hidden; /* prevent repaint */
				padding-top: 30px;
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: auto;
				overflow-y: scroll;
				overflow-x: hidden;
			}
			.lines-inner {
				display: block;
			}
			.line {
			}

			.chat-actions {
				width: 100%;
				display: grid;
				grid-template-columns: 1fr auto 1fr;
				align-items: center;
				padding: 4px 8px;
				box-sizing: border-box;
			}

			.chat-action {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				position: relative;
			}

			.chat-actions button {
				border: none;
				padding: 0px;
				margin: 0px;
				background: transparent;
				min-width: 24px;
				height: 22px;
				cursor: pointer;
			}
			.chat-actions button:hover {
				outline: #464646 solid 1px;
			}
			.chat-actions button:active {
				background: #333333;
			}
			.chat-actions button:active img {
				transform: scale(0.95);
			}

			.scroll-to-bottom {
				transition: opacity 0.125s ease, transform 0.125s ease;
				transform: translate(0, 10px);
				opacity: 0;
				pointer-events: none;
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgb(8 8 8 / 75%);
				backdrop-filter: blur(12px);
				padding: 8px 15px;
				text-align: center;
				box-sizing: border-box;
				z-index: 100000;
				cursor: pointer;
				margin: 4px 40px;
				border-radius: 6px;
				border: 1px solid #19191b;
			}

			:host(:not([locked])) .scroll-to-bottom {
				transform: translate(0, 0);
				opacity: 1;
				pointer-events: all;
				transition: opacity 0.25s ease, transform 0.25s ease;
			}

			:host(:not([locked])) .scroll-to-bottom:hover {
				transform: scale(1.005);
				transition: none;
			}
			:host(:not([locked])) .scroll-to-bottom:active {
				transform: scale(0.995);
			}

			/* // webkit scrollbars */
			::-webkit-scrollbar {
				width: 8px;
				margin: 5px 0;
			}
			::-webkit-scrollbar-button {
				display: none;
			}
			::-webkit-scrollbar-track-piece {
				background: transparent;
			}
			::-webkit-scrollbar-thumb {
				background: var(--color-scrollbar-thumb, #1c1c1c);
				border-radius: 5px;
			}
			::-webkit-scrollbar-thumb:hover {
				background: var(--color-scrollbar-thumb-hover, #333333);
			}
			::-webkit-scrollbar-corner {
				background: transparent;
			}

			.chat-channel-name {
				opacity: 0.75;
				font-size: 12px;
				font-weight: 400;
			}
			.chat-channel-name:hover {
				text-decoration: underline;
				cursor: pointer;
			}
			.chat-channel-name:active {
				opacity: 0.5;
			}
			:host([modview]) .chat-channel-name {
				display: none;
			}
		`;
	}
}

customElements.define("sample-chat", Chat);
