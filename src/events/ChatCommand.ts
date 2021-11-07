import Events from "./Events";

export default class ChatCommandEvent extends Event {

    data: {
        message: string
    };

    canceled = false;

    constructor(message: string) {
        super(Events.ChatCommandEvent);
        this.data = {
            message
        }
    }

    cancel() {
        this.canceled = true;
    }

}