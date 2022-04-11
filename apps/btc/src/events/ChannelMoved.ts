import AppEvent from './AppEvent';

export default class ChannelMovedEvent extends AppEvent {
	data: {
		from_index: number;
		to_index: number;
	};

	constructor(to_index: number, from_index: number) {
		super('app-channel-moved');
		this.data = {
			from_index: from_index,
			to_index: to_index
		};
	}
}
