import { UserLevel, CommandList } from "./../CommandList";

const defaultCommandList = [
	{
		command: "mods",
		syntax: "/mods",
		userlevel: UserLevel.everyone,
		description:
			"This command will display a list of all chat moderators for that specific channel.",
	},
	{
		command: "vips",
		syntax: "/vips",
		userlevel: UserLevel.everyone,
		description:
			"This command will display a list of VIPs for that specific channel.",
	},
	{
		command: "color",
		syntax: "/color COLOR",
		userlevel: UserLevel.everyone,
		description: "Allows you to change the color of your username",
	},
	{
		command: "block",
		syntax: "/block USERNAME",
		userlevel: UserLevel.everyone,
		description:
			"This command will allow you to block all messages from a specific user in chat and whispers if you do not wish to see their comments.",
	},
	{
		command: "unblock",
		syntax: "/unblock USERNAME",
		userlevel: UserLevel.everyone,
		description:
			"This command will allow you to remove users from your block list that you previously added.",
	},
	{
		command: "me",
		syntax: "/me TEXT",
		userlevel: UserLevel.everyone,
		description:
			"This command will remove the colon that typically appears after your chat name and colorizes your message text with your names color.",
	},
	{
		command: "w",
		syntax: "/w USERNAME MESSAGE",
		userlevel: UserLevel.everyone,
		description:
			"This command sends a private message to another user on Twitch.",
	},
	{
		command: "timeout",
		syntax: "/timeout USERNAME SECONDS",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to temporarily ban someone from the chat room for 10 minutes by default.",
	},
	{
		command: "ban",
		syntax: "/ban USERNAME",
		userlevel: UserLevel.moderator,
		description:
			"This command will allow you to permanently ban a user from the chat room.",
	},
	{
		command: "unban",
		syntax: "/unban USERNAME",
		userlevel: UserLevel.moderator,
		description:
			"This command will allow you to lift a permanent ban on a user from the chat room. You can also use this command to end a ban early; this also applies to timeouts.",
	},
	{
		command: "slow",
		syntax: "/slow SECONDS",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to set a limit on how often users in the chat room are allowed to send messages (rate limiting).",
	},
	{
		command: "slowoff",
		syntax: "/slowoff",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to disable slow mode if you had previously set it.",
	},
	{
		command: "followers",
		syntax: "/followers",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you or your mods to restrict chat to all or some of your followers, based on how long they’ve followed — from 0 minutes (all followers) to 3 months.",
	},
	{
		command: "followersoff",
		syntax: "/followersoff",
		userlevel: UserLevel.moderator,
		description:
			"This command will disable followers only mode if it was previously enabled on the channel.",
	},
	{
		command: "subscribers",
		syntax: "/subscribers",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to set your room so only users subscribed to you can talk in the chat room.",
	},
	{
		command: "subscribersoff",
		syntax: "/subscribersoff",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to disable subscribers only chat room if you previously enabled it.",
	},
	{
		command: "clear",
		syntax: "/clear",
		userlevel: UserLevel.moderator,
		description:
			"This command will allow the Broadcaster and chat moderators to completely wipe the previous chat history.",
	},
	{
		command: "emoteonly",
		syntax: "/emoteonly",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to set your room so only messages that are 100% emotes are allowed.",
	},
	{
		command: "emoteonlyoff",
		syntax: "/emoteonlyoff",
		userlevel: UserLevel.moderator,
		description:
			"This command allows you to disable emote only mode if you previously enabled it.",
	},
	{
		command: "commercial",
		syntax: "/commercial",
		userlevel: UserLevel.moderator,
		description:
			"An Affiliate and Partner command that runs a commercial, for 30 seconds, for all of your viewers.",
	},
	{
		command: "poll",
		syntax: "/poll",
		userlevel: UserLevel.moderator,
		description: "Open create Poll dialog.",
	},
];

export default defaultCommandList;

export class TwitchCommands {
	static async fetchCommandList(_: string): Promise<CommandList> {
		return {
			commandPrefix: "/",
			serviceName: "Twitch",
			commands: defaultCommandList.map((cmd: any) => {
				return {
					command: cmd.command,
					description: cmd.description,
					userlevel: cmd.userlevel,
				};
			}),
		};
	}
}
