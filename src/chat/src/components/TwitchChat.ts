import { css, html } from "lit";
import Application from "../app/App";
import Webbrowser from "../util/Webbrowser";
import Chat from "./Chat";
import ContextMenu from "./ContextMenu";
import Format from "../util/Format";
import Events from "../events/Events";
// Components
import "./FluidInput";
import "./Timer";
import "./UserList";

export default class TwitchChatComponent extends Chat {
	channel: string | undefined;

	bio: any;

	static get styles() {
		return css`
			${super.styles}

			.info {
				opacity: 0.5;
				padding: 10px 15px;
			}

			@keyframes bio-slidein {
				from {
					transform: translate(0, -0px);
					opacity: 0;
				}
			}
			.bio-container {
				position: relative;
			}
			.bio {
				animation: bio-slidein 0.2s ease;
				display: grid;
				grid-template-columns: auto 1fr;
				padding: 90px 30px 40px;
				margin-bottom: 10px;
				background: linear-gradient(45deg, rgb(12, 12, 12), transparent);
				z-index: 10;
				position: relative;
			}
			.profile-image {
				border-radius: 50%;
				overflow: hidden;
				width: 112px;
				height: 112px;
				border: 3px solid rgb(148, 74, 255);
			}
			.thumbnail {
				position: absolute;
				height: 100%;
				width: 100%;
				right: 0;
				z-index: 1;
			}
			.thumbnail async-img {
				max-height: 100%;
				width: 100%;
				object-fit: cover;
			}
			.profile-image img {
				width: 100%;
			}
			.pin {
				margin-left: 30px;
			}
			.profile-name {
				font-size: 28px;
				margin-bottom: 5px;
				white-space: nowrap;
			}
			.profile-desc {
				margin-top: 20px;
				grid-column: 1 / span 2;
				line-height: 150%;
			}
			.viewcount {
				opacity: 0.5;
				margin-bottom: 5px;
			}
			.game {
				opacity: 0.5;
				margin-bottom: 5px;
				font-weight: bold;
			}
			.language {
				opacity: 0.5;
				margin-bottom: 5px;
			}

			.chat-state-icons {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				grid-column: 3;
			}
			.user-state-icon,
			.room-state-icon {
				display: none;
				color: #eee;
				opacity: 0.5;
				margin-left: 5px;
				cursor: default;
				justify-content: center;
				align-items: center;
				margin-left: 8px;
				user-select: none;
				padding: 0px 3px;
			}
			.room-state-icon.action-expand {
				padding: 0px;
			}
			.user-state-icon[active],
			.room-state-icon[active] {
				display: flex;
			}
			:host([modview]) .room-state-icon {
				opacity: 0.25;
				display: flex;
			}
			:host([modview]) .room-state-icon[active] {
				opacity: 1;
			}

			:host([modview]) .room-state-icon {
				border: none;
				margin: 0px;
				background: transparent;
				min-width: 16px;
				height: 22px;
				cursor: pointer;
				border-radius: 3px;
			}
			:host([modview]) .room-state-icon:hover {
				outline: #464646 solid 1px;
			}
			:host([modview]) .room-state-icon:active {
				background: #333333;
			}
			:host([modview]) .room-state-icon:active img {
				transform: scale(0.95);
			}

			.dropdown-content:focus-within,
			.dropdown-content:hover,
			.dropdown-content:focus,
			.dropdown-button:focus ~ .dropdown-content {
				display: block;
			}

			.dropdown-content {
				position: absolute;
				top: calc(100% + 5px);
				left: -10px;
				display: none;
			}

			.expand-list {
				display: inline-block;
				margin-left: 8px;
			}

			.event-feed {
				position: absolute;
				top: 60px;
				left: 10px;
				/* outline: 1px solid white; */
				right: 10px;
				height: 40px;
				z-index: 1000;
				pointer-events: none;
			}

			.chat-title {
				grid-column: 2;
				position: relative;
				z-index: 100;
				width: 100%;
				padding: 5px 6px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				align-items: center;
				white-space: nowrap;
				font-size: 12px;
				font-weight: 400;
				color: #ababab;
				display: flex;
				flex-wrap: wrap;
				background: linear-gradient(rgba(0, 0, 0, 0.33) 20%, transparent);
				padding-bottom: 30px;
			}

			.chat-title > div {
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.chat-title span {
				opacity: 0.5;
			}

			.tag {
				display: inline-block;
				border-radius: 12px;
				background: rgba(25, 25, 28, 0.9);
				padding: 5px 10px;
				backdrop-filter: blur(8px);
				border: 1px solid #1f1f23;
				max-width: 100%;
				margin-right: 4px;
				margin-bottom: 4px;
				font-size: 12px;
				color: #cbcbcb;
				box-shadow: 1px 2px 8px #00000049;
			}

			.tag img {
				vertical-align: bottom;
			}

			.title-tag {
				width: 100%;
				font-weight: 500;
				font-size: 13px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		`;
	}

	async openUserlist() {
		const listEle = this.shadowRoot.querySelector("chat-user-list");
		listEle.updateList();
	}

	async openVisPanel() {}

	appendRedemtion(data: any) {
		this.appendNote(
			html`${data.user_name} redeemed ${data.title} for ${data.cost}
				<img src="${data.image_url}" height="18px" width="18px" />`
		);
	}

	openSlowModeSettins(e) {
		const channel = Application.getChannel(this.channel);
		const menu = ContextMenu.openOn(e.target, "down");
		const input = document.createElement("fluid-input");
		input.value = channel?.slowmode_time;
		input.steps = "1";
		input.min = 1;
		input.max = 600;
		input.suffix = "sec";
		input.style.width = "100px";
		input.addEventListener("change", (e) => {
			channel.slowmode_time = input.value;
		});
		menu.append(input);
	}

	openFollowerModeSettings(e) {
		const channel = Application.getChannel(this.channel);
		const menu = ContextMenu.openOn(e.target, "down");
		const input = document.createElement("fluid-input");
		input.value = channel.followermode_time;
		input.steps = "1";
		input.min = 0;
		input.max = 600;
		input.suffix = "min";
		input.style.width = "100px";
		input.addEventListener("change", (e) => {
			channel.followermode_time = input.value;
		});
		menu.append(input);
	}

	stream_title: string = "";
	game: string = "";
	viewer_count: number = 0;
	status: string = "";
	thumbnail_url?: string;
	stream_start: number = 0;

	setTitle(options: any | null) {
		if (options) {
			const {
				thumbnail_url,
				viewer_count = 0,
				started_at = 0,
				game_name = "",
				title = "",
			} = options;

			this.thumbnail_url = thumbnail_url
				.replace("{width}", "853")
				.replace("{height}", "480");

			this.game = game_name;
			this.stream_start = started_at;
			this.stream_title = title;
			this.viewer_count = viewer_count;
		} else {
			this.stream_start = 0;
			this.stream_title = "";
			this.viewer_count = 0;
		}

		this.requestUpdate();
	}

	setBio(bio_data: any) {
		this.bio = bio_data;
		this.requestUpdate();
	}

	constructor() {
		super();

		Application.on(Events.ChannelInfoChanged, async (e) => {
			const channel = e.data.channel;
			if (channel.channel_login === this.channel) {
				this.requestUpdate();
			}
		});

		Application.on(Events.ChannelStateChanged, async (e) => {
			const channel = e.data.channel;
			if (channel.channel_login === this.channel) {
				this.requestUpdate();

				if (channel.moderator || channel.broadcaster) {
					this.setAttribute("modview", "");
				} else {
					this.removeAttribute("modview");
				}
			}
		});
	}

	render() {
		let channel = Application.getChannel(this.channel);

		if (!channel) {
			channel = {};
		}

		return html`
			<div class="header">
				<div class="chat-actions">
					<div>
						<div class="chat-action">
							<button
								title="Close chat"
								@click="${(e) => {
									Application.removeChannel(channel.channel_login);
								}}"
							>
								<svg-icon icon="close"></svg-icon>
							</button>
						</div>
						<div class="chat-action">
							<button
								class="dropdown-button"
								title="Userlist"
								@click="${() => {
									this.openUserlist();
								}}"
							>
								<svg-icon icon="people"></svg-icon>
							</button>
							<div class="dropdown-content" tabindex="0">
								<chat-user-list
									channel="${channel.channel_login}"
								></chat-user-list>
							</div>
						</div>
						<!-- <div class="chat-action">
                            <button class="dropdown-button" title="Show and Hide Elements" @click="${() => {
							this.openVisPanel();
						}}">    
                                <img src="./images/visibility_white_24dp.svg" width="16px" height="16px" />
                            </button>
                            <div class="dropdown-content" tabindex="0">
                                
                            </div>
                        </div> -->
						<div class="chat-action">
							<button
								title="Open Stream"
								@click="${() => {
									Webbrowser.openInBrowwser(
										`https://www.twitch.tv/${channel.channel_login}`
									);
								}}"
							>
								<svg-icon icon="open"></svg-icon>
							</button>
						</div>
					</div>
					<div
						class="chat-channel-name"
						@click="${() => {
							Webbrowser.openInBrowwser(
								`https://www.twitch.tv/${channel.channel_login}`
							);
						}}"
					>
						${channel.channel_login}
					</div>
					<div class="chat-state-icons">
						<div class="chat-action">
							<div
								class="room-state-icon"
								title="Slow mode for ${channel.slow_mode}s"
								?active="${channel.slow_mode !== 0}"
								@click="${() => channel.toggleSlowMode(channel)}"
							>
								<svg-icon icon="slowmode"></svg-icon>
							</div>
							<div
								class="room-state-icon action-expand"
								title="Slowmode time"
								@click="${this.openSlowModeSettins}"
							>
								<svg-icon icon="expand_more_black_24dp"></svg-icon>
							</div>
						</div>
						<div class="chat-action">
							<div
								class="room-state-icon"
								title="Follow mode for ${channel.follwers_only}s"
								?active="${channel.follwers_only >= 0}"
								@click="${() => channel.toggleFollowerMode(channel)}"
							>
								<svg-icon icon="follower"></svg-icon>
							</div>
							<div
								class="room-state-icon action-expand"
								title="Follower time"
								@click="${this.openFollowerModeSettings}"
							>
								<svg-icon icon="expand_more_black_24dp"></svg-icon>
							</div>
						</div>
						<div class="chat-action">
							<div
								class="room-state-icon"
								title="Emote only mode"
								?active="${channel.emote_only}"
								@click="${() => channel.toggleEmoteOnlyMode(channel)}"
							>
								<svg-icon icon="emote"></svg-icon>
							</div>
						</div>
						<div class="chat-action">
							<div
								class="room-state-icon"
								title="Sub only mode"
								?active="${channel.subscribers_only}"
								@click="${() => channel.toggleSubOnlyMode(channel)}"
							>
								<svg-icon icon="subscriber"></svg-icon>
							</div>
						</div>
						<div class="chat-action">
							<div
								class="room-state-icon"
								title="r9k mode"
								?active="${channel.r9k}"
								@click="${() => channel.toggleR9kMode(channel)}"
							>
								r9k
							</div>
						</div>
						<div class="chat-action">
							<div
								class="user-state-icon"
								title="Moderator"
								?active="${channel.moderator}"
							>
								<img
									src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2"
									width="18px"
									height="18px"
								/>
							</div>
						</div>
						<div class="chat-action">
							<div
								class="user-state-icon"
								title="Broadcaster"
								?active="${channel.broadcaster}"
							>
								<img
									src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2"
									width="18px"
									height="18px"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="chat-title">
				${!this.stream_title
					? html`
							<div class="tag" title="Status">Offline</div>

							${channel.chatter_count > 0
								? html`
										<div class="tag" title="Chatters">
											<svg-icon icon="Viewer"></svg-icon>
											${Format.number(channel.chatter_count)}
										</div>
								  `
								: ""}
					  `
					: html`
							<div class="tag title-tag" title="${this.stream_title}">
								${this.stream_title}
							</div>
							<div class="tag" title="Uptime">
								Live -
								<stream-timer starttime="${this.stream_start}"></stream-timer>
							</div>
							<div class="tag" title="Game">
								<svg-icon icon="Game"></svg-icon>
								${this.game}
							</div>
							<div class="tag" title="Viewercount">
								<svg-icon icon="Viewer"></svg-icon>
								${Format.number(this.viewer_count)}
							</div>
					  `}
			</div>
			<div class="event-feed"></div>
			<div class="scroll-to-bottom" @click="${() => this.scrollToLatest()}">
				<span>Scroll to the bottom</span>
			</div>
			<div class="lines" @scroll="${(e) => this.onScroll(e)}">
				${this.bio
					? html`
							<div class="bio-container">
								<div class="thumbnail">
									<async-img src="${this.thumbnail_url}" />
								</div>
								<div class="bio">
									<div class="profile-image">
										<img
											src="${channel.profile_image_url || ""}"
											width="125px"
										/>
									</div>
									<div class="pin">
										<div class="profile-name">
											${this.bio.broadcaster_name}
											${this.bio.broadcaster_type == "partner"
												? html` <svg-icon icon="verified"></svg-icon> `
												: ""}
										</div>
										<div class="game">${this.bio.game_name}</div>
										<div class="language">
											${Format.lang(this.bio.broadcaster_language)}
										</div>
										<div class="viewcount">
											${Format.number(channel.channel_view_count)} views
										</div>
									</div>
									${channel.channel_description == ""
										? ""
										: html`
												<div class="profile-desc">
													${channel.channel_description}
												</div>
										  `}
								</div>
							</div>
					  `
					: ""}
				<slot class="lines-inner"></slot>
			</div>
		`;
	}
}

customElements.define("twitch-chat", TwitchChatComponent);
