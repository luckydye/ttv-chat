import TwitchEmotes from './../services/emotes/TwitchEmotes';
import { css, html } from 'lit';
import ContextMenu from './ContextMenu';
import Emotes from '../services/Emotes';
import Application from '../app/App';
import { EmoteSet } from '../services/emotes/TwitchEmotes';
import Channel from '../app/Channel';

export default class EmotePicker extends ContextMenu {
	static get styles() {
		return css`
			${super.styles}
			:host {
				display: block;
				right: 10px !important;
				bottom: 60px;
				top: auto;
				left: auto;
			}
			.emote-list {
				height: 300px;
				width: 350px;
				max-width: calc(100vw - 60px);
				overflow: auto;
				padding: 8px 12px;
			}
			.category {
				display: flex;
				flex-wrap: wrap;
				--grid-gap: 5px;
				margin-right: calc(var(--grid-gap) * -1px);
				padding: 0 4px;
			}
			.category img {
				object-fit: contain;
				cursor: pointer;
				max-height: 32px;
				margin: 0 var(--grid-gap) var(--grid-gap) 0;
			}
			.category img:hover {
				background: #333;
				outline: 1px solid #eeeeeebe;
			}
			.category img:active {
				transform: scale(0.95);
			}

			label {
				display: block;
				font-weight: 300;
				margin: 15px 0 10px 0;
				opacity: 0.5;
				text-transform: capitalize;
			}
			label:first-child {
				margin-top: 0;
			}

			.tabs {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;
				justify-content: center;
				justify-items: center;
				grid-gap: 12px;
				padding: 4px 12px 8px 12px;
			}

			.tab {
				line-height: 24px;
				vertical-align: middle;
				position: relative;
				text-align: center;
				cursor: pointer;
				width: 100%;
				user-select: none;
				border-radius: 4px;
				font-size: 12px;
				opacity: 0.5;
			}
			.tab[active] {
				opacity: 1;
			}
			.tab[active]::after {
				opacity: 1;
			}
			.tab:hover {
				background: #ffffff08;
			}
			.tab:active {
				background: #ffffff14;
			}
			.tab::after {
				content: '';
				display: block;
				bottom: 0px;
				left: 50%;
				width: 100%;
				height: 2px;
				background: grey;
				opacity: 0.5;
				text-align: center;
			}

			.emote-preview {
				position: absolute;
				bottom: calc(100% + 8px);
				left: 0;
				background: inherit;
				border: inherit;
				border-radius: inherit;
				display: flex;
				align-items: center;
				padding: 12px;
				backdrop-filter: inherit;
				font-size: 18px;
				font-weight: 400;
			}
			.emote-preview img {
				margin-right: 20px;
			}
		`;
	}

	twitch_user_emotes: Array<EmoteSet> = [];

	connectedCallback() {
		super.connectedCallback();

		this.shadowRoot.addEventListener('pointermove', (e) => {
			let newTarget = null;
			if (e.target.hasAttribute('emote')) {
				newTarget = e.target;
			} else {
				newTarget = null;
			}

			if (newTarget !== this.currentEmote) {
				this.currentEmote = newTarget as HTMLImageElement;
				this.requestUpdate();
			}
		});

		const channel = Application.getActiveChannel();
		TwitchEmotes.getEmoteSets(channel.emoteSets).then((sets) => {
			this.twitch_user_emotes = sets;
			this.requestUpdate();
		});
	}

	currentEmote: HTMLImageElement | null = null;

	constructor(...args) {
		super(...args);

		this.currentEmote = null;
	}

	tabSelected = 'twitch';

	groupEmoteSets(sets: Array<EmoteSet>, currentChannel: Channel): Array<EmoteSet> {
		const groups = [];

		setLoop: for (let set of sets) {
			for (let group of groups) {
				if (group.name == set.name) {
					group.emotes = Object.assign(group.emotes, set.emotes);
					continue setLoop;
				}
			}
			groups.unshift(set);
		}

		return groups.sort((a, b) => {
			if (a.name == 'globals') {
				return 1;
			}
			if (b.name == 'globals') {
				return -1;
			}
			if (a.name.toLocaleLowerCase() == currentChannel.channel_login.toLocaleLowerCase()) {
				return -1;
			}
			if (b.name.toLocaleLowerCase() == currentChannel.channel_login.toLocaleLowerCase()) {
				return 1;
			}
			return 0;
		});
	}

	renderEmoteTab(channel: Channel, tab: string) {
		const grouped = this.groupEmoteSets(this.twitch_user_emotes, channel);

		if (tab == 'twitch') {
			if (grouped.length == 0) {
				return html`<net-loader />`;
			} else {
				return html`
					${grouped.map((set) => {
						const emotes = Object.keys(set.emotes);
						return emotes.length > 0
							? html`
									<label>${set.name}</label>
									<div class="category">
										${emotes.map(
											(emote) => html`<img
												src="${set.emotes[emote].url_x2}"
												alt="${emote}"
												emote
												@click="${() => {
													const input = document.querySelector('chat-input');
													input.insert(emote);
												}}"
											/> `
										)}
									</div>
							  `
							: '';
					})}
				`;
			}
		}

		const channel_emotes = Emotes.getChachedChannelEmotes(channel.channel_id);
		const global_emotes = Emotes.global_emotes;

		return html`
			${channel_emotes[tab] && Object.keys(channel_emotes[tab]).length > 0
				? html`
						<label>Channel</label>
						<div class="category">
							${Object.keys(channel_emotes[tab]).map(
								(emote) => html`<img
									src="${channel_emotes[tab][emote].url_x2}"
									alt="${emote}"
									emote
									@click="${() => {
										const input = document.querySelector('chat-input');
										input.insert(emote);
									}}"
								/> `
							)}
						</div>
				  `
				: ''}
			${global_emotes[tab] && Object.keys(global_emotes[tab]).length > 0
				? html`
						<label>Global</label>
						<div class="category">
							${Object.keys(global_emotes[tab]).map(
								(emote) => html`<img
									src="${global_emotes[tab][emote].url_x2}"
									alt="${emote}"
									emote
									@click="${() => {
										const input = document.querySelector('chat-input');
										input.insert(emote);
									}}"
								/> `
							)}
						</div>
				  `
				: ''}
		`;
	}

	selectTab(tab: string) {
		this.tabSelected = tab;
		this.requestUpdate();
	}

	render() {
		const channel = Application.getActiveChannel();
		const emoteTab = this.renderEmoteTab(channel, this.tabSelected);

		return html`
			<div class="tabs">
				<div
					class="tab"
					?active="${this.tabSelected == 'twitch'}"
					tab-id="twitch"
					@click="${(e) => this.selectTab(e.target.getAttribute('tab-id'))}"
				>
					Twitch
				</div>
				<div
					class="tab"
					?active="${this.tabSelected == 'bttv'}"
					tab-id="bttv"
					@click="${(e) => this.selectTab(e.target.getAttribute('tab-id'))}"
				>
					BTTV
				</div>
				<div
					class="tab"
					?active="${this.tabSelected == 'ffz'}"
					tab-id="ffz"
					@click="${(e) => this.selectTab(e.target.getAttribute('tab-id'))}"
				>
					FFZ
				</div>
				<div
					class="tab"
					?active="${this.tabSelected == '7tv'}"
					tab-id="7tv"
					@click="${(e) => this.selectTab(e.target.getAttribute('tab-id'))}"
				>
					7TV
				</div>
			</div>

			<div class="emote-list">${emoteTab}</div>

			${this.currentEmote != null
				? html`
						<div class="emote-preview">
							<img src="${this.currentEmote.src}" />
							<span>${this.currentEmote.alt}</span>
						</div>
				  `
				: ''}
		`;
	}
}

customElements.define('emote-picker', EmotePicker);
