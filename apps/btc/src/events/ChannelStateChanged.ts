import Channel from '../Channel';
import AppEvent from './AppEvent';

export default class ChannelStateChanged extends AppEvent {

    data: { channel: Channel };

    constructor(channel: Channel) {
        super("app-channel-state-changed");
        this.data = {
            channel: channel,
        }
    }

}