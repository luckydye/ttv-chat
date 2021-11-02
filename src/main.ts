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
import Events from './events/Events';
import Application from './App';
import Account from './Account';

async function onLogin(account: Account) {
    console.log('Logged in', account);

    await Application.init();

    Application.setAccount(account);

    console.log('Initialized');

    window.dispatchEvent(new Event(Events.Initialize));
}

window.addEventListener('app-login', (e) => {
    onLogin(e.data.account);
})
