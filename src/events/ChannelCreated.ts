import Events from './Events';
import Channel from '../Channel';

export default class ChannelCreatedEvent extends Event {

    data: {
        id: string,
        channel: Channel
    };

    constructor(channel: Channel) {
        super(Events.ChannelCreated);
        this.data = {
            id: channel.channel_id,
            channel
        }
    }

}