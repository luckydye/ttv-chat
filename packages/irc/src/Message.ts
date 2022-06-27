declare global {
	interface IRCMessage {
		tags: Record<string, string>;
		prefix: string;
		command: string;
		parameters: string[];
		channel?: string;
		author?: string;
		message?: string;
	}
}

export class IRC {
	static parseTags(str: string): Record<string, string> {
		const tags = {};

		if (str) {
			for (let tag of str.split(";")) {
				const parts = tag.split("=");
				tags[parts[0]] = parts[1];
			}
		}

		return tags;
	}

	static parse(rawMessage): IRCMessage {
		let str = rawMessage;

		// tags
		const tagMatch = str.match(/^@\S+/);
		const tags = tagMatch ? this.parseTags(tagMatch[0].slice(1)) : {};

		str = str.slice((tagMatch || [])[0]?.length + 1 || 0);

		// prefix
		const prefixMatch = str.match(/\:(\S+)/);
		const prefix = prefixMatch ? prefixMatch[1] : null;

		str = str.slice((prefixMatch || [])[0]?.length + 1 || 0);

		const command = str.split(" ")[0];

		const parameters: string[] = [];
		const params: string[] = str.split(" ").slice(1);
		for (let param of params) {
			if (param[0] === ":") break;
			parameters.push(param);
		}

		const message = str.split(":")[1];

		const authorMatch = prefix.match(/^(\S+)!/);
		const channel = parameters.find((param) => param[0] === "#");

		return {
			tags,
			prefix,
			command,
			parameters,
			channel: channel,
			author: authorMatch && authorMatch.length > 1 ? authorMatch[1] : null,
			message,
		};
	}
}

// const examples = `

// :luckydye!luckydye@luckydye.tmi.twitch.tv JOIN #4charan

// :ashercarson!ashercarson@ashercarson.tmi.twitch.tv PRIVMSG #jakenbakelive :What was the score of Shake Shack in Korea?

// :tmi.twitch.tv 001 luckydye :Welcome, GLHF!
// :tmi.twitch.tv 002 luckydye :Your host is tmi.twitch.tv
// :tmi.twitch.tv 003 luckydye :This server is rather new
// :tmi.twitch.tv 004 luckydye :-
// :tmi.twitch.tv 375 luckydye :-
// :tmi.twitch.tv 372 luckydye :You are in a maze of twisty passages, all alike.
// :tmi.twitch.tv 376 luckydye :>

// :luckydye!luckydye@luckydye.tmi.twitch.tv JOIN #jakenbakelive
// @badge-info=;badges=;color=#E3C123;display-name=luckydye;emote-sets=0,19194,367651,402645,300206301,300374282,300548772,301435838,301928579,302574719,302760317,303403867,304837132,304854265,305503401,305526097,305668326,310902874,322739167,324225453,326728993,328281496,339963230,354625183,406384597,449552617,450305385,472873131,477339272,484908742,488737509,491346491,537206155,564265402,592920959,610186276,4218cf41-46d7-474e-8467-4869aca9b39d;mod=0;subscriber=0;user-type= :tmi.twitch.tv USERSTATE #jakenbakelive
// @emote-only=0;followers-only=0;r9k=0;room-id=11249217;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #jakenbakelive

// @badge-info=subscriber/5;badges=subscriber/3,sub-gifter/1;client-nonce=8d531f0e7a5918b563711b6784e99e09;color=#1E86E8;display-name=PlutoniumOC;emotes=;first-msg=0;flags=;id=72ac13cd-042c-4c0e-8d09-855cb536911f;mod=0;returning-chatter=0;room-id=11249217;subscriber=1;tmi-sent-ts=1656328172741;turbo=0;user-id=90601172;user-type= :plutoniumoc!plutoniumoc@plutoniumoc.tmi.twitch.tv PRIVMSG #jakenbakelive :K H A N

// @badge-info=;badges=premium/1;client-nonce=55eeba540b3296e0a9d584dfedde4474;color=#0096CC;display-name=Athanas2221;emotes=;first-msg=0;flags=;id=fafc4b78-86a4-49e1-b86f-5015c308ea8f;mod=0;returning-chatter=0;room-id=11249217;subscriber=0;tmi-sent-ts=1656328195373;turbo=0;user-id=24681766;user-type= :athanas2221!athanas2221@athanas2221.tmi.twitch.tv PRIVMSG #jakenbakelive :BOGGERS

// :luckydye.tmi.twitch.tv 353 luckydye = #tsukilovesyou :luckydye
// :luckydye.tmi.twitch.tv 366 luckydye #tsukilovesyou :End of /NAMES list
// `.split(/\n/);

// for (let msg of examples) {
// 	if (msg) {
// 		const parsed = Message.parse(msg);
// 		console.log(parsed);
// 	}
// }
