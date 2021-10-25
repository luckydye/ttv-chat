import './components/Titlebar';
import './components/Authenticator';
import TwitchChat from './components/Chat';
import './services/Twitch';
import { emit, listen } from '@tauri-apps/api/event';

window.addEventListener('load', e => {
    console.log(e);
})

async function main() {
    const chat = new TwitchChat();
    console.log(chat);
    

    function handleMessage(msg) {
        const data = JSON.parse(msg);
    
        const channel = data[0];
        const text = data[1];
    
        // console.log(channel, text);
    
        chat.appendLine(text);
    }

    document.body.append(chat);

    const unlisten = await listen('chat.message', event => {
        handleMessage(event?.payload?.message);
    })
}

main();