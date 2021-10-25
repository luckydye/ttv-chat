import './components/Titlebar';
import './components/Authenticator';
import './components/ChatInput';
import TwitchChat from './components/Chat';
import './services/Twitch';
import IRCChatClient from './services/IRCChatClient';

async function main() {
    const chat = new TwitchChat();
    console.log(chat);
    

    function handleMessage(msg) {
        chat.appendMessage(msg);
    }

    document.body.append(chat);

    IRCChatClient.listen(handleMessage);
}

main();