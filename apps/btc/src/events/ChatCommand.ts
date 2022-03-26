import AppEvent from "./AppEvent";

export default class ChatCommandEvent extends AppEvent {

    data: {
        message: string
    };

    canceled = false;

    constructor(message: string) {
        super("app-chat-command");
        this.data = {
            message
        }
    }

    cancel() {
        this.canceled = true;
    }

}