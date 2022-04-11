export interface Command {
	command: string;
	description: string;
	userlevel: UserLevel;
}

export interface CommandList {
	commandPrefix: string;
	serviceName: string;
	commands: Array<Command>;
}

export enum UserLevel {
	everyone,
	subscriber,
	vip,
	moderator,
	editor,
	broadcaster
}
