import Channel from '../Channel';
import AppEvent from './AppEvent';

export default class ChannelCreatedEvent extends AppEvent {

    static get type() {
        return "app-channel-created";
    }

    data: {
        id: string,
        channel: Channel
    };

    constructor(channel: Channel) {
        super(ChannelCreatedEvent.type);
        this.data = {
            id: channel.channel_id,
            channel
        }
    }

}