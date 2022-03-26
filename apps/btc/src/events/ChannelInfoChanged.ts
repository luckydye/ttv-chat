import AppEvent from './AppEvent';
import Channel from '../Channel';

export default class ChannelInfoChanged extends AppEvent {

    static get type() {
        return "app-channel-changed";
    }

    data: { channel: Channel };

    constructor(channel: Channel) {
        super(ChannelInfoChanged.type);
        this.data = {
            channel: channel,
        }
    }

}