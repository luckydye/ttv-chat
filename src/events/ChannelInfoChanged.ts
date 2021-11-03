import Events from "./Events";
import Channel from '../Channel';

export default class ChannelInfoChanged extends Event {

    data: { channel: Channel };

    constructor(channel: Channel) {
        super(Events.ChannelInfoChanged);
        this.data = {
            channel: channel,
        }
    }

}