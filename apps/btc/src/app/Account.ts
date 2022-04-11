import IRC from '../services/IRC';
import { UserInfo } from '../services/twitch/Api';
import { ServiceWorkerAdapter } from './../adapter/ServiceWorkerAdapter';

export default class Account {
	// holds information for the logged in user
	// acounts are persistent, and are optionaly authenticated.

	user_login: string;
	user_id: string;
	profile_image: string;

	constructor(user_info: UserInfo, oauth_token: string) {
		this.user_login = user_info.login;
		this.user_id = user_info.id;
		this.profile_image = user_info.profile_image_url;

		IRC.connectoToChat(this.user_login, oauth_token);

		console.log('Logging in..');

		const adapter = new ServiceWorkerAdapter();
		adapter.login(this.user_login, oauth_token);
	}
}
