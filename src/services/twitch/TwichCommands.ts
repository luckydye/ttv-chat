import { CommandList } from "../CommandList";

const defaultCommandList = [
    {
        command: 'mods',
        syntax: '/mods',
        description: 'This command will display a list of all chat moderators for that specific channel.'
    },
    {
        command: 'vips',
        syntax: '/vips',
        description: 'This command will display a list of VIPs for that specific channel.'
    },
    {
        command: 'color',
        syntax: '/color COLOR',
        description: 'Allows you to change the color of your username'
    },
    {
        command: 'block',
        syntax: '/block USERNAME',
        description: 'This command will allow you to block all messages from a specific user in chat and whispers if you do not wish to see their comments.'
    },
    {
        command: 'unblock',
        syntax: '/unblock USERNAME',
        description: 'This command will allow you to remove users from your block list that you previously added.'
    },
    {
        command: 'me',
        syntax: '/me TEXT',
        description: 'This command will remove the colon that typically appears after your chat name and colorizes your message text with your names color.'
    },
    {
        command: 'w',
        syntax: '/w USERNAME MESSAGE',
        description: 'This command sends a private message to another user on Twitch.'
    },
    {
        command: 'timeout',
        syntax: '/timeout USERNAME SECONDS',
        description: 'This command allows you to temporarily ban someone from the chat room for 10 minutes by default.'
    },
    {
        command: 'ban',
        syntax: '/ban USERNAME',
        description: 'This command will allow you to permanently ban a user from the chat room.'
    },
    {
        command: 'unban',
        syntax: '/unban USERNAME',
        description: 'This command will allow you to lift a permanent ban on a user from the chat room. You can also use this command to end a ban early; this also applies to timeouts.'
    },
    {
        command: 'slow',
        syntax: '/slow SECONDS',
        description: 'This command allows you to set a limit on how often users in the chat room are allowed to send messages (rate limiting).'
    },
    {
        command: 'slowoff',
        syntax: '/slowoff',
        description: 'This command allows you to disable slow mode if you had previously set it.'
    },
    {
        command: 'followers',
        syntax: '/followers',
        description: 'This command allows you or your mods to restrict chat to all or some of your followers, based on how long they’ve followed — from 0 minutes (all followers) to 3 months.'
    },
    {
        command: 'followersoff',
        syntax: '/followersoff',
        description: 'This command will disable followers only mode if it was previously enabled on the channel.'
    },
    {
        command: 'subscribers',
        syntax: '/subscribers',
        description: 'This command allows you to set your room so only users subscribed to you can talk in the chat room.'
    },
    {
        command: 'subscribersoff',
        syntax: '/subscribersoff',
        description: 'This command allows you to disable subscribers only chat room if you previously enabled it.'
    },
    {
        command: 'clear',
        syntax: '/clear',
        description: 'This command will allow the Broadcaster and chat moderators to completely wipe the previous chat history.'
    },
    {
        command: 'emoteonly',
        syntax: '/emoteonly',
        description: 'This command allows you to set your room so only messages that are 100% emotes are allowed.'
    },
    {
        command: 'emoteonlyoff',
        syntax: '/emoteonlyoff',
        description: 'This command allows you to disable emote only mode if you previously enabled it.'
    },
    {
        command: 'commercial',
        syntax: '/commercial',
        description: 'An Affiliate and Partner command that runs a commercial, for 30 seconds, for all of your viewers.'
    }
]

export default defaultCommandList;

export class TwitchCommands {

    static async fetchCommandList(_: string): Promise<CommandList> {
        return {
            commandPrefix: "/",
            serviceName: "Twitch",
            commands: defaultCommandList.map((cmd: any) => {
                return {
                    command: cmd.command,
                    description: cmd.description
                }
            })
        }
    }

}