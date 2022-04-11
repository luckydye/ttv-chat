import AppEvent from './AppEvent';

export default class ChannelRemovedEvent extends AppEvent {
	data: { name: string };

	constructor(channel_name: string) {
		super('app-channel-removed');
		this.data = {
			name: channel_name
		};
	}
}
