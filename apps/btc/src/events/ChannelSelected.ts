import AppEvent from './AppEvent';

export default class ChannelSelecteddEvent extends AppEvent {
	data: { channel: string };

	constructor(channel_name: string) {
		super('app-channel-selected');
		this.data = {
			channel: channel_name
		};
	}
}
