import ChannelCreatedEvent from '../events/ChannelCreated';
import ChannelRemovedEvent from '../events/ChannelRemoved';
import ChannelMovedEvent from '../events/ChannelMoved';
import ChannelSelecteddEvent from '../events/ChannelSelected';
import Channel from './Channel';
import Account from './Account';
import AppEvent from '../events/AppEvent';

interface ApplicationState {
	selectedChannel: string;
	channels: Array<string>;
}

let applicationState: ApplicationState = {
	selectedChannel: '@',
	channels: []
};

let channels: Set<Channel> = new Set();
let currentAccoumt: Account;

export default class Application {
	static on(eventOrEventArray: any | Array<any>, callback: (ev: AppEvent) => void) {
		if (eventOrEventArray instanceof Array) {
			for (let event of eventOrEventArray) {
				addEventListener(event, callback as EventListener);
			}
		} else {
			addEventListener(eventOrEventArray, callback as EventListener);
		}
	}

	static getCurrentAccount(): Account {
		return currentAccoumt;
	}

	static setAccount(account: Account) {
		currentAccoumt = account;
	}

	static saveState() {
		localStorage.setItem('save-state', JSON.stringify(applicationState));
	}

	static async init() {
		const state = localStorage.getItem('save-state');
		if (state) {
			const json = JSON.parse(state);
			applicationState = Object.assign(applicationState, json);
		}

		const mentionChannel = new Channel('@');
		channels.add(mentionChannel);

		for (let channel of applicationState.channels) {
			this.createChannel(channel);
		}
	}

	static getSelectedChannel() {
		return applicationState.selectedChannel;
	}

	static getChannels() {
		return applicationState.channels;
	}

	static getActiveChannel() {
		return this.getChannel(applicationState.selectedChannel);
	}

	static selectChannel(room_name: string) {
		applicationState.selectedChannel = room_name;
		window.dispatchEvent(new ChannelSelecteddEvent(room_name));
		this.saveState();
	}

	static moveChannel(channel: string, newIndex: number) {
		const rooms = applicationState.channels;

		const currIndex = rooms.indexOf(channel);
		rooms.splice(currIndex, 1);
		const part1 = rooms.slice(0, newIndex);
		const part2 = rooms.slice(newIndex);

		applicationState.channels = [...part1, channel, ...part2];

		window.dispatchEvent(new ChannelMovedEvent(newIndex, currIndex));
		this.saveState();
	}

	static createChannel(channel_name: string) {
		if (applicationState.channels.indexOf(channel_name) === -1) {
			applicationState.channels.push(channel_name);
		}
		const channel = new Channel(channel_name);
		channels.add(channel);

		window.dispatchEvent(new ChannelCreatedEvent(channel));
		this.saveState();
	}

	static removeChannel(channel_name: string) {
		const index = applicationState.channels.indexOf(channel_name);
		applicationState.channels.splice(index, 1);

		const channel = this.getChannel(channel_name);
		channels.delete(channel);

		const newSelected = Math.min(Math.max(0, index), applicationState.channels.length - 1);
		this.selectChannel(this.getChannels()[newSelected]);

		window.dispatchEvent(new ChannelRemovedEvent(channel_name));
		this.saveState();
	}

	static getChannel(channel_name: string) {
		for (let channel of channels) {
			if (channel.channel_login === channel_name) {
				return channel;
			}
		}
	}
}
