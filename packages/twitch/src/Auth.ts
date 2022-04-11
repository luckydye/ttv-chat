import { TwitchApi } from './Api';
import { URI } from './Utils';

let logged_in_user: any | null;
let logged_in = false;

class LoginEvent extends Event {
	data: any;

	constructor(token) {
		super('twitch-login-success');

		this.data = { token };
	}
}

export async function handleAuthenticatedUser(token: string): Promise<boolean> {
	const userinfo = await fetchTwitchAuthApi('/oauth2/userinfo', token);
	const username = userinfo.preferred_username;

	console.log('Login', username);
	if (username == null) {
		// token invalid -> logout
		logout();
		return false;
	} else {
		localStorage.setItem('user-token', token);
		logged_in = true;
	}

	const user_data = await TwitchApi.getUserInfo(username);

	if (user_data) {
		console.log(user_data, token);
		logged_in_user = user_data;

		window.dispatchEvent(new LoginEvent(token));

		return true;
	}

	return false;
}

export function getLoggedInUser() {
	if (logged_in) {
		return logged_in_user;
	}
}

export function logout() {
	localStorage.removeItem('user-token');
	logged_in = false;
	logged_in_user = null;

	location.reload();
}

async function fetchTwitchAuthApi(path: string = '/oauth2/userinfo', token: string) {
	const url = `https://id.twitch.tv${path}`;
	return fetch(url, {
		headers: {
			Authorization: 'Bearer ' + token
		}
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
		});
}

export function checLogin(): Promise<boolean> | boolean {
	const token = localStorage.getItem('user-token');
	if (token && !logged_in) {
		return handleAuthenticatedUser(token);
	}
	return false;
}

export async function authClientUser() {
	// check if already logged in
	if (checLogin() !== false) {
		return;
	}

	// else start auth process
	const type = 'token+id_token';
	const scopes = [
		'channel:edit:commercial',
		'channel:manage:polls',
		'channel:manage:predictions',
		'channel:manage:redemptions',
		'channel:read:hype_train',
		'channel:read:polls',
		'channel:read:predictions',
		'channel:read:redemptions',
		'channel:manage:broadcast',
		'channel:read:editors',
		'moderation:read',
		'user:manage:blocked_users',
		'user:read:blocked_users',

		'bits:read',
		'channel:moderate',
		'chat:read',
		'chat:edit',
		'whispers:read',

		'openid'
	];

	const claims = {
		userinfo: {
			preferred_username: null
		}
	};

	const url =
		`https://id.twitch.tv/oauth2/authorize?client_id=${TwitchApi.CLIENT_ID}` +
		`&redirect_uri=${TwitchApi.REDIRECT_URI}` +
		`&response_type=${type}` +
		`&scope=${scopes.join('%20')}` +
		`&claims=${JSON.stringify(claims)}`;

	const bc = new BroadcastChannel('obs-tools-auth-com');

	bc.onmessage = (msg) => {
		const data = msg.data;

		if (data.access_token) {
			const access_token = data.access_token;
			handleAuthenticatedUser(access_token);
		}
	};

	const win = window.open(url);
}
