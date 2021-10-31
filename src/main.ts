//
import { Application } from './App';
import './components/Chat';
import './components/ChatInput';
import './components/ChatRooms';
import './components/Login';
import './components/Profile';
import './components/Tooltip';
import './components/TwitchChat';
import IRCChatClient from './IRCChatClient';
import MessageParser, { EventMessage, UserMessage } from './MessageParser';
import Foramt from './Format';
import Badges from './services/Badges';
import Emotes from './services/Emotes';
import { getUserInfo } from './services/Twitch';

const chatElements: { [key: string]: any } = {};

async function createChat(channel: string) {

    const info = await getUserInfo(channel);
    Application.setChannelDetails(channel, info);
    Badges.getChannelBadges(info.id);
    Emotes.getChannelEmotes(info.id);

    chatElements[channel] = document.createElement("twitch-chat");
    chatElements[channel].setRoom(channel);
    IRCChatClient.joinChatRoom(channel.toLocaleLowerCase());

    if(Application.getSelectedRoom() == channel) {
        renderSelecetdChat();
    }
}

function renderSelecetdChat() {
    const input = document.querySelector('chat-input');
    const room = Application.getSelectedRoom();
    const container = document.querySelector('.chat');
    for(let child of container?.children) {
        child.remove();
    }
    container?.append(chatElements[room]);
    if(room === "@") {
        input?.setAttribute('disabled', '');
    } else {
        input?.removeAttribute('disabled');
    }
    requestAnimationFrame(() => {
        chatElements[room].scrollToLatest();
    })
}

async function main() {

    await Application.init();

    // custom mentions channel
    chatElements["@"] = document.createElement("sample-chat");
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

    //
    // IRC shit
    // move this into the chat element
    //   or maybe move all of this irc logic out of the chat *Element* and put it somwhere else?
    IRCChatClient.listen('chat.message', async (msg: UserMessage) => {
        const chat = chatElements[msg.channel];
        const chatMessages = MessageParser.parse(msg);
        
        if(chat) {
            for(let msg of chatMessages) {
                if(msg.tagged) {
                    const mentionChat = Application.getChats("@");
                    mentionChat.appendMessage(msg);
                }
                
                chat.appendMessage(msg);
            }
        }
    });

    IRCChatClient.listen('chat.info', (msg: EventMessage) => {
        const chat = chatElements[msg.channel];
        const chatMessages = MessageParser.parse(msg);

        if(chat) {
            for(let msg of chatMessages) {
                switch(msg.type) {
                    case "info":
                        chat.appendInfo(msg);
                        break;
                    case "message":
                        msg.highlighted = true;
                        if(msg.tagged) {
                            const mentionChat = Application.getChats("@");
                            mentionChat.appendMessage(msg);
                        }
                        chat.appendMessage(msg);
                        break;
                }
            }
        }
    });

    IRCChatClient.listen('chat.notice', (msg) => {
        const chat = chatElements[msg.channel_login];
        if(chat) {
            chat.appendNote(msg.message_text);
        }
        chat.update();
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
                chat.appendNote(`${action.user_login} got banned.`);
            }
            if(msg.action.UserTimedOut) {
                // got timed out for xs
                chat.appendNote(`${action.user_login} got timed out for ${Foramt.seconds(action.timeout_length.secs)}.`);
            }
        }
    });
    //
    // IRC shit END
    //

    for(let channel of Application.getRooms()) {
        createChat(channel);
    }
}

window.addEventListener('loggedin', e => {
    main().catch(err => console.error(err));
})
