import Account from '../Account';

export default class LoginEvent extends Event {

    data: { account: Account };

    constructor(account: Account) {
        super('app-login');
        this.data = {
            account: account
        }
    }

}