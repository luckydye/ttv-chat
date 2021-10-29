//
import './components/Login';
import './components/Profile';
import './components/ChatInput';
import './components/ChatRooms';
import './components/Chat';
import './services/Twitch';
import IRCChatClient from './services/IRCChatClient';
import { ChatMessage } from './services/IRCChatClient';
import { Application } from './App';

const chatElements: { [key: string]: any } = {};

function createChat(channel: string) {
    chatElements[channel] = document.createElement("twitch-chat");
    chatElements[channel].setRoom(channel);
    IRCChatClient.joinChatRoom(channel);
}

function renderSelecetdChat() {
    const room = Application.getSelectedRoom();
    const container = document.querySelector('.chat');
    for(let child of container?.children) {
        child.remove();
    }
    container?.append(chatElements[room]);
}

async function main() {

    await Application.init();

    // custom mentions channel
    chatElements["@"] = document.createElement("twitch-chat");
    chatElements["@"].setRoom("Mentions");

    Application.setChats(chatElements);

    window.addEventListener('addedroom', e => {
        createChat(e.room_name);
    });
    window.addEventListener('closeroom', e => {
        IRCChatClient.partChatRoom(e.room_name);
        delete chatElements[e.room_name];
    });

    window.addEventListener('selectroom', e => {
        renderSelecetdChat();
    });

    IRCChatClient.listen('chat.message', (msg: ChatMessage) => {
        const chat = chatElements[msg.channel];
        if(chat) {
            chat.appendMessage(msg);
        }
    });

    IRCChatClient.listen('chat.info', (msg: ChatMessage) => {
        const chat = chatElements[msg.channel];
        if(chat) {
            chat.appenLine(msg.message);
        }
    });

    IRCChatClient.listen('chat.notice', (msg) => {
        const chat = chatElements[msg.channel_login];
        if(chat) {
            chat.appenNote(msg.message_text);
        }

        chat.update();
    });

    IRCChatClient.listen('chat.user', (msg: ChatMessage) => {
        // save to internal map. lol this is so bad
    });

    interface ClearChatAction {
        UserBanned: {
            user_login: string,
            user_id: string,
        },
        UserTimedOut: {
            user_login: string,
            user_id: string,
            timeout_length: number,
        }
    }

    interface ClearChatMessage {
        channel_login: string,
        channel_id: string,
        action: ClearChatAction,
        server_timestamp: Date,
    }

    IRCChatClient.listen('chat.clear', (msg: ClearChatMessage) => {
        const chat = chatElements[msg.channel_login];

        if(chat) {
            const action = msg.action.UserBanned || msg.action.UserTimedOut;
            const lines = chat.querySelectorAll(`[userid="${action.user_id}"]`);
            for(let line of [...lines]) {
                line.setAttribute("deleted", "");
            }

            if(msg.action.UserBanned) {
                // got banned
                chat.appenNote(`${action.user_login} got banned.`);
            }
            if(msg.action.UserTimedOut) {
                // got timed out for xs
                chat.appenNote(`${action.user_login} got timed out for ${action.timeout_length.secs} seconds.`);
            }
        }
    });

    for(let channel of Application.getRooms()) {
        createChat(channel);
    }

    renderSelecetdChat();
}

window.addEventListener('loggedin', e => {
    main();
})
