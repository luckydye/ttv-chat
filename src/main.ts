import './components/Titlebar';
import './components/Authenticator';
import './services/Twitch';
import { emit, listen } from '@tauri-apps/api/event';

window.addEventListener('load', e => {
    console.log(e);
})

async function main() {
    const unlisten = await listen('chat.message', event => {
        console.log(event);
    })
}

main();