import Events from './Events';

export default class ChannelMovedEvent extends Event {

    data: {
        from_index: number,
        to_index: number,
    };

    constructor(to_index: number, from_index: number) {
        super(Events.ChannelMoved);
        this.data = {
            from_index: from_index,
            to_index: to_index,
        }
    }

}