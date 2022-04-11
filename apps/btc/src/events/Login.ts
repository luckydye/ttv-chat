import AppEvent from './AppEvent';
import Account from '../app/Account';

// TODO: extend all these events from AppEvent

export default class LoginEvent extends AppEvent {
	data: { account: Account };

	constructor(account: Account) {
		super('app-login');
		this.data = {
			account: account
		};
	}
}
