//
import './components/Authenticator';
import './components/ChatInput';
import './components/ChatRooms';
import './components/Chat';
import './services/Twitch';
import IRCChatClient from './services/IRCChatClient';
import { ChatMessage, UserState } from './services/IRCChatClient';
import { Application } from './App';

async function main() {

    await Application.init();

    // sort incoming messages into chats: TODO
    const chatElements = {};

    // join all channels
    for(let channel of Application.getRooms()) {
        IRCChatClient.joinChatRoom(channel);
        const chatElement = document.createElement("twitch-chat");
        chatElements[channel] = chatElement;
        chatElement.setRoom(channel);
    }

    window.addEventListener('selectroom', e => {
        renderSelecetdChat();
    });

    function renderSelecetdChat() {
        const room = Application.getSelectedRoom();
        const container = document.querySelector('.chat');
        for(let child of container?.children) {
            child.remove();
        }
        container?.append(chatElements[room]);
    }

    IRCChatClient.listen('chat.message', (msg: ChatMessage) => {
        const chat = chatElements[msg.channel];
        if(chat) {
            chat.appendMessage(msg);
        }
    });

    IRCChatClient.listen('chat.info', (msg: ChatMessage) => {
        console.log('notice', msg);
        
        const chat = chatElements[msg.channel];
        if(chat) {
            chat.appenLine(msg.message);
        }
    });

    IRCChatClient.listen('chat.user', (msg: UserState) => {
        console.log('user', msg);
    });

    renderSelecetdChat();
}

main(); 