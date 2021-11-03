import Events from "./Events";
import { ChatMessage, ChatInfoMessage } from "../MessageParser";

export default class ChatMessageEvent extends Event {

    data: {
        channel: string,
        message: ChatMessage | ChatInfoMessage
    };

    constructor(channel: string, message: ChatMessage | ChatInfoMessage) {
        super(Events.ChatMessageEvent);
        this.data = {
            channel,
            message
        }
    }

}