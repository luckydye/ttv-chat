import TwitchPubsub from './Pubsub';

const CLIENT_ID = '8gwe8mu523g9cstukr8rnnwspqjykf';
const REDIRECT_URI = 'https://stadium-dev.github.io/obs-tools-widget/dock/public/';

// "/users" reference from twitch api
export interface UserInfo {
	id: string;
	login: string;
	display_name: string;
	type: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	email: string;
	created_at: string;
}

interface ChannelInfo {
	game_id?: string;
	broadcaster_language?: string;
	title?: string;
}

interface ChannelEditor {
	user_id: string;
	user_name: string;
	created_at: string;
}

export class TwitchApi {
	static get CLIENT_ID() {
		return CLIENT_ID;
	}

	static get REDIRECT_URI() {
		return REDIRECT_URI;
	}

	static async fetch(path: string = '/users', query = '') {
		const token = localStorage.getItem('user-token');
		const url = `https://api.twitch.tv/helix${path}?${query}&client_id=${CLIENT_ID}`;
		return fetch(url, {
			headers: {
				'Authorization': 'Bearer ' + token,
				'Client-Id': CLIENT_ID
			}
		})
			.then((res) => res.json())
			.catch((err) => {
				console.error(err);
			});
	}

	static async getUserInfo(user_login: string): Promise<UserInfo | undefined> {
		if (user_login.length <= 2) {
			return undefined;
		}

		const userinfo = await this.fetch('/users', `login=${user_login}`);
		if (userinfo.data) {
			return userinfo.data[0];
		}
	}

	static async getCustomReward(user_id: string) {
		const userinfo = await this.fetch('/channel_points/custom_rewards', `broadcaster_id=${user_id}`);
		return userinfo;
	}

	static async connectToPubSub(authToken: string): Promise<TwitchPubsub> {
		if (authToken) {
			const pubsub = new TwitchPubsub(authToken);
			return pubsub.connect().then(() => pubsub);
		} else {
			throw new Error('not logged in, can not connect to pubsub.');
		}
	}

	static async getStreams(user_id: string) {
		return (await this.fetch('/streams', 'user_id=' + user_id)).data;
	}

	static async getChannel(user_id: string) {
		return (await this.fetch('/channels', 'broadcaster_id=' + user_id)).data;
	}

	static async getClip(clip_id: string) {
		return (await this.fetch('/clips', 'id=' + clip_id)).data;
	}

	static async setChannelInfo(channel_id: string, info: ChannelInfo) {
		return fetch('https://api.twitch.tv/helix/channels?broadcaster_id=' + channel_id, {
			method: 'PATCH',
			body: JSON.stringify(info)
		});
	}

	static async getChannelEditors(channel_id: string): Promise<Array<ChannelEditor>> {
		return (await this.fetch('/channels/editors', 'broadcaster_id=' + channel_id)).data;
	}

	static createPoll() {}

	static async getModdedChannels(channel_login: string) {
		// https://modlookup.3v.fi/api/user-v3/luckydye
		return fetch(`https://modlookup.3v.fi/api/user-v3/${channel_login}`, {
			headers: {
				'User-Agent': 'https://github.com/luckydye/better-twitch-chat'
			}
		})
			.then((res) => res.json())
			.then((json) => {
				return json.channels;
			});
	}
}
