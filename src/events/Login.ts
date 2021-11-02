import Account from '../Account';
import Events from './Events';

export default class LoginEvent extends Event {

    data: { account: Account };

    constructor(account: Account) {
        super(Events.Login);
        this.data = {
            account: account
        }
    }

}