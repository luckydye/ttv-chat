import Events from "./Events";

export default class ChannelSelecteddEvent extends Event {

    data: { channel: string };

    constructor(channel_name: string) {
        super(Events.ChannelSelected);
        this.data = {
            channel: channel_name
        }
    }

}