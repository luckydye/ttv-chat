import { CommandList } from "./CommandList";

export default class NightbotApi {

    static async fetchCommandList(channel_login: string): Promise<CommandList> {
        const user = await this.fetchChannel(channel_login);

        // https://api.nightbot.tv/1/commands
        const url = `https://api.nightbot.tv/1/commands`;
        return fetch(url, {
            headers: {
                'nightbot-channel': user.channel._id
            }
        }).then(res => res.json()).then(({ commands }) => {
            return {
                serviceName: "Nightbot",
                commands: commands.map((cmd: any) => {
                    return {
                        command: cmd.name,
                        description: cmd.message
                    }
                })
            };
        });
    }

    static async fetchChannel(channel_name: string) {
        // https://api.nightbot.tv/1/channels/t/<channel_login>
        const url = `https://api.nightbot.tv/1/channels/t/${channel_name}`;
        return fetch(url).then(res => res.json());
    }

}
