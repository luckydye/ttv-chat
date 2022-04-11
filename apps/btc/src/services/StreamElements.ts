import { CommandList, UserLevel } from './CommandList';

// refactor this into a "cachedFetch" with cache IDs and TTLs
export default class StreamElementsApi {
	static async fetchCommandList(channel_login: string): Promise<CommandList> {
		const user = await this.fetchChannel(channel_login);

		// Command array of

		// {
		//     "commandId": "raffle_join",
		//     "command": "join",
		//     "accessLevel": 100,
		//     "enabled": false,
		//     "enabledOnline": true,
		//     "enabledOffline": true,
		//     "moduleEnabled": false,
		//     "moduleId": "raffle",
		//     "cost": 0,
		//     "cooldown": {
		//       "user": 0,
		//       "global": 0
		//     },
		//     "aliases": [

		//     ],
		//     "regex": "",
		//     "description": "Join an active raffle"
		// },

		// https://api.streamelements.com/kappa/v2/bot/commands/${channel_id}/default
		// and
		// https://api.streamelements.com/kappa/v2/bot/commands/${channel_id}
		const url1 = `https://api.streamelements.com/kappa/v2/bot/commands/${user._id}/default`;
		const url2 = `https://api.streamelements.com/kappa/v2/bot/commands/${user._id}`;

		return fetch(url2)
			.then((res) => res.json())
			.then(async (list) => {
				const defaults = await fetch(url1).then((res) => res.json());

				// everyone     - 100
				// subscriber   - 250
				// vip          - 400
				// mod          - 500
				// boradcaster  - 1500

				return {
					commandPrefix: '!',
					serviceName: 'StreamElements',
					commands: [...defaults, ...list]
						.filter((cmd) => cmd.enabled)
						.map((cmd: any) => {
							let userlevel = cmd.accessLevel;
							if (cmd.accessLevel <= 100) userlevel = UserLevel.everyone;
							if (cmd.accessLevel >= 250) userlevel = UserLevel.subscriber;
							if (cmd.accessLevel >= 400) userlevel = UserLevel.vip;
							if (cmd.accessLevel >= 500) userlevel = UserLevel.moderator;
							if (cmd.accessLevel >= 1500) userlevel = UserLevel.broadcaster;
							return {
								command: cmd.command,
								description: cmd.description,
								userlevel: userlevel
							};
						})
				};
			});
	}

	static async fetchChannel(channel_name: string) {
		// Streamelements account info

		// {
		//     "profile": {
		//       "headerImage": "https://cdn.streamelements.com/static/user/profile_header_default.png",
		//       "title": "nidalida's profile"
		//     },
		//     "provider": "twitch",
		//     "broadcasterType": "affiliate",
		//     "suspended": false,
		//     "_id": "61604b6734c70fa55861fdcd",
		//     "providerId": "732086957",
		//     "avatar": "https://static-cdn.jtvnw.net/jtv_user_pictures/93c6f9d6-dbd4-42c9-a99b-eab6414df447-profile_image-300x300.png",
		//     "username": "nidalida",
		//     "alias": "nidalida",
		//     "displayName": "nidalida",
		//     "inactive": false,
		//     "isPartner": true
		// }

		// https://api.streamelements.com/kappa/v2/channels/${channel_login}
		const url = `https://api.streamelements.com/kappa/v2/channels/${channel_name}`;
		return fetch(url).then((res) => res.json());
	}
}
