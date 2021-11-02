export default class ChannelRemovedEvent extends Event {

    data: { id: string };

    constructor(channel_id: string) {
        super('app-channel-removed');
        this.data = {
            id: channel_id
        }
    }

}