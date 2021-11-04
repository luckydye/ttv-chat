import { CommandList } from "./CommandList";

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
        const url = `https://api.streamelements.com/kappa/v2/bot/commands/${user._id}/default`;
        return fetch(url).then(res => res.json()).then(list => {
            return {
                serviceName: "StreamElements",
                commands: list.map((cmd: any) => {
                    return {
                        command: cmd.command,
                        description: cmd.description
                    }
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
        return fetch(url).then(res => res.json());
    }

}
