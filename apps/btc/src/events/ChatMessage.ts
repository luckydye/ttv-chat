import AppEvent from './AppEvent';
import { ChatMessage, ChatInfoMessage } from '../components/MessageParser';

export default class ChatMessageEvent extends AppEvent {
	data: {
		channel: string;
		message: ChatMessage | ChatInfoMessage;
	};

	constructor(channel: string, message: ChatMessage | ChatInfoMessage) {
		super('app-chat-message');
		this.data = {
			channel,
			message
		};
	}
}
