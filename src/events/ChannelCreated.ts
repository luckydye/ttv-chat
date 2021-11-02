import Channel from '../Channel';

export default class ChannelCreatedEvent extends Event {

    data: {
        id: string,
        channel: Channel
    };

    constructor(channel: Channel) {
        super('app-channel-created');
        this.data = {
            id: channel.channel_id,
            channel
        }
    }

}