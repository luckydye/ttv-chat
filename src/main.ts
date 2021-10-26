import './components/Titlebar';
import './components/Authenticator';
import './components/ChatInput';
import TwitchChat from './components/Chat';
import './services/Twitch';
import IRCChatClient from './services/IRCChatClient';
import { ChatMessage, UserState } from '../services/IRCChatClient';

async function main() {
    const chat = new TwitchChat();
    document.body.append(chat);

    const room = "richwcampbell";

    IRCChatClient.listen('chat.message', (msg: ChatMessage) => {
        if(msg.channel == room) {
            chat.appendMessage(msg);
        }
    });

    IRCChatClient.listen('chat.user', (msg: UserState) => {
        console.log('user', msg);
    });

    setTimeout(() => {
        chat.setRoom(room);
        IRCChatClient.joinChatRoom(room);
    }, 1000);
}

main();