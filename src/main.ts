import './components/Titlebar';
import './components/Authenticator';
import './services/Twitch';

window.addEventListener('tauri.loaded', e => {
    console.log(e);
})