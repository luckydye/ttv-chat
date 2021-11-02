import Events from './Events';

export default class ChannelRemovedEvent extends Event {

    data: { name: string };

    constructor(channel_name: string) {
        super(Events.ChannelRemoved);
        this.data = {
            name: channel_name
        }
    }

}