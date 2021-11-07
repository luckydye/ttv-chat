//
import './components/Chat';
import './components/ChatInput';
import './components/ChatRooms';
import './components/Login';
import './components/Profile';
import './components/TwitchChat';
import './components/ProfileIndicator';
import './components/Tooltip';
//
import Events, { on } from './events/Events';
import Application from './App';
import Account from './Account';
import Badges from './services/Badges';
import Emotes from './services/Emotes';
import IRC from './services/IRC';


// TODO: get a better method to switch between views
function renderSelecetdChat(channel: string) {
    const input = document.querySelector('chat-input');
    const container = document.querySelector('.chat');
    if (container) {
        for (let child of container.children) {
            if(child.hide != undefined) {
                child.hide();
            }
        }

        const chat = Application.getChannel(channel);
        const chatEle = chat?.chat;

        if(chatEle) {
            chatEle.removeAttribute('hidden');
            if (!chatEle.parentNode) {
                container.append(chatEle);
            }
            if (channel === "@") {
                input?.setAttribute('disabled', '');
            } else {
                input?.removeAttribute('disabled');
            }
    
            chatEle.show();
        }
    }
}

async function onLogin(account: Account) {
    console.log('Logged in', account);

    // load critical resources
    await Badges.getGlobalBadges();
    await Emotes.getGlobalEmotes();

    // init state
    await Application.init();

    Application.setAccount(account);

    console.log('Initialized');

    window.dispatchEvent(new Event(Events.Initialize));
    
    on(Events.ChannelSelected, e => {
        const channel = e.data.channel;
        renderSelecetdChat(channel);
    });

    renderSelecetdChat(Application.getSelectedChannel());
}

window.Events = Events;
window.IRC = IRC;

window.addEventListener('app-login', (e) => {
    onLogin(e.data.account);
})
