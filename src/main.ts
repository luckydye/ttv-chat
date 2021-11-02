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


function renderSelecetdChat(channel: string) {
    const input = document.querySelector('chat-input');
    const container = document.querySelector('.chat');
    if (container) {
        for (let child of container?.children) {
            child.setAttribute('hidden', '');
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
    
            requestAnimationFrame(() => {
                chatEle.lock();
            });
        }
    }
}

async function onLogin(account: Account) {
    console.log('Logged in', account);

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

window.addEventListener('app-login', (e) => {
    onLogin(e.data.account);
})
