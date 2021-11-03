import Events from "./Events";
import Channel from '../Channel';

export default class ChannelStateChanged extends Event {

    data: { channel: Channel };

    constructor(channel: Channel) {
        super(Events.ChannelStateChanged);
        this.data = {
            channel: channel,
        }
    }

}