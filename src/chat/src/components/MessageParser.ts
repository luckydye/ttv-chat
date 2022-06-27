import { TwitchMessage } from "./../app/TwitchMessage";
// Parse incoming messages into html´´ templates.
import { html, TemplateResult } from "lit";
import { render } from "lit-html";
import Badges from "../services/Badges";
import Emotes from "../services/Emotes";
import { TwitchEmote } from "../services/emotes/TwitchEmotes";
import { getLoggedInUser } from "../services/Auth";
import Webbrowser from "../util/Webbrowser";
import Color from "../util/Color";

const Default_EventMessage_Color = "rgb(12, 12, 12)";
const ColorEventTypeMap = {
	SubOrResub: "rgb(33, 27, 37)",
	Raid: "rgb(33, 27, 37)",
	SubGift: "rgb(33, 27, 37)",
	SubMysteryGift: "rgb(33, 27, 37)",
	AnonSubMysteryGift: "rgb(33, 27, 37)",
	GiftPaidUpgrade: "rgb(33, 27, 37)",
	AnonGiftPaidUpgrade: "rgb(33, 27, 37)",
	Ritual: "rgb(33, 27, 37)",
	BitsBadgeTier: "rgb(33, 27, 37)",
};

///////////////
// types going into the parser

type CharRange = [number, number];

interface Emote {
	id: string; // emote id
	ranges: CharRange[]; // chat range of emote word
}

interface Badge {
	id: string; // badge id
	name: string; // badge name
	version: number; // badge version
	description: string; // badge description (like 5 months sub)
}

interface Event {
	id: string;
	data: object;
	type:
		| "SubOrResub"
		| "Raid"
		| "SubGift"
		| "SubMysteryGift"
		| "AnonSubMysteryGift"
		| "GiftPaidUpgrade"
		| "AnonGiftPaidUpgrade"
		| "Ritual"
		| "BitsBadgeTier";
}

export interface UserMessage {
	message_type: "user";
	id: string; // message id
	text: string; // user message
	channel: string; // channel
	user_name: string; // username
	user_id: string; // user id
	color: Array<number>; // username color
	emotes: Array<Emote>; // emotes
	badges: Array<Badge>; // badges + badge_info
	timestamp: Date; // tmi server timestamp
	is_action: boolean; // is /me message
	bits: number; // amounts of bits attached to this message
	tags: { [key: string]: any }; // hgihlighted messages etc.
}

export interface EventMessage {
	message_type: "event";
	id: string; // message id
	text: string; // system text
	message: UserMessage | null; // attatched user message
	channel: string; // channel
	timestamp: Date; // tmi server timestamp
	event: Event | null; // event causing this message
}

//
////////

///////////////
// types coming out of the parser

export interface ChatMessage {
	type: "message";
	id: string; // message id
	user_name: string;
	user_id: string;
	highlighted: boolean; // has hgihlighted tag
	tagged: boolean; // the authenticated user got tagged
	action: boolean; // is a /me message
	reply: boolean; // is a reply
	timestamp: Date;
	text: string;
	content: () => any; // parsed message
}

export interface ChatInfoMessage {
	type: "info";
	id: string; // message id
	background_color: string; // custom msg background color for info type (sub, notice, etc.)
	timestamp: Date;
	content: TemplateResult; // parsed message
}

//
//////

const messageCache: Array<any> = [];
const footprintMap: Array<Array<string>> = [];

export default class MessageParser {
	// in short. recieve the network message and form into a client side representation.
	// like if its highligted, tagged or a reply...

	channel: Channel;

	constructor(channel?: Channel) {
		this.channel = channel;
	}

	parse(message: TwitchMessage): Array<ChatMessage | ChatInfoMessage> {
		if (message.type == "user") {
			return this.parseUserMessage(message);
		}
		if (message.type == "system") {
			return this.parseEventMessage(message);
		}
		return [];
	}

	parseUserMessage(message: TwitchMessage): Array<ChatMessage> {
		const mm: Array<ChatMessage> = [];
		const m = this.parseChatTextMessage(message);
		if (m) {
			mm.push(m);
		}
		return mm;
	}

	parseEventMessage(
		message: EventMessage
	): Array<ChatMessage | ChatInfoMessage> {
		// null if no user message included
		const user = message.message
			? this.parseChatTextMessage(message.message)
			: null;

		const event: ChatInfoMessage = {
			type: "info",
			id: message.id,
			background_color: message.event
				? ColorEventTypeMap[message.event.type]
				: Default_EventMessage_Color,
			timestamp: message.timestamp,
			content: html`
				<div class="line">
					<div class="message">${message.text}</div>
				</div>
			`,
		};

		return user == null ? [event] : [user, event];
	}

	parseEmotes(
		message_text: string,
		channel_id: string,
		sender_name: string,
		message_emtoes?: Array<Emote>
	): { [key: string]: { name: string; emote: any; service: string } } {
		const client_user = getLoggedInUser();
		const user_login = client_user?.user_login;

		// The services/emotes/Emote struct
		const wordEmoteMap: {
			[key: string]: { name: string; emote: any; service: string };
		} = {};

		// get cached channel emotes
		let channel_emotes = Emotes.getChachedChannelEmotes(channel_id);

		// collect emotes (url) for this message
		if (message_emtoes) {
			for (let emote of message_emtoes) {
				for (let range of emote.ranges) {
					const start = range[0];
					const end = range[1];

					const wordToReplace = message_text.slice(start, end + 1);

					wordEmoteMap[wordToReplace] = {
						name: wordToReplace,
						service: "twitch",
						emote: new TwitchEmote(emote),
					};
				}
			}
		}

		const msg_words = message_text.split(" ");

		// find words to replace with
		//  (3rd party emtoes | global emtoes | links | metions | msg tagged)
		msg_words.forEach((str) => {
			// find channel emote repalcement
			if (channel_emotes) {
				for (let service in channel_emotes) {
					if (
						!channel_emotes[service] ||
						(service == "twitch" && sender_name != user_login)
					) {
						continue;
					}
					if (str in channel_emotes[service]) {
						wordEmoteMap[str] = {
							name: str,
							service: service,
							emote: channel_emotes[service][str],
						};
					}
				}
			}
			// global emotes repalcement
			if (Emotes.global_emotes) {
				for (let service in Emotes.global_emotes) {
					if (!Emotes.global_emotes[service]) {
						continue;
					}
					if (str in Emotes.global_emotes[service]) {
						wordEmoteMap[str] = {
							name: str,
							service: service,
							emote: Emotes.global_emotes[service][str],
						};
					}
				}
			}
		});

		return wordEmoteMap;
	}

	parseChatTextMessage(message: TwitchMessage): ChatMessage | undefined {
		const client_user = getLoggedInUser();
		const user_login = client_user?.user_login;

		if (!message.message) return;

		const channel_id = message.roomId;
		const reward_id = message.tags["custom-reward-id"];
		const user_id = message.tags["user-id"];
		const message_id = message.tags["id"];
		const user_name = message.tags["display-name"];
		let timestamp = message.tags["tmi-sent-ts"];

		let redemtion_title = "custom reward";

		if (reward_id) {
			const redemtion = this.channel.findReward(reward_id);
			if (redemtion) {
				redemtion_title = redemtion.title;
			}
		}

		let color = message.tags["color"];
		let highlighted = message.tags["msg-id"] == "highlighted-message";
		let action = false;
		let isReply = message.tags["reply-parent-msg-id"] != null;
		let tagged = false;
		// The services/emotes/Emote struct
		const wordLinkMap: { [key: string]: string } = {};
		const wordMentionMap: { [key: string]: string } = {};

		// get cached channel badges
		let channel_badges = Badges.getChachedChannelBadges(channel_id);
		// get cached channel emotes

		const wordEmoteMap = this.parseEmotes(
			message.message,
			channel_id,
			message.name,
			message.emotes
		);

		const msg_words = message.message.split(" ");

		// find words to replace with
		//  (3rd party emtoes | global emtoes | links | metions | msg tagged)
		msg_words.forEach((str) => {
			// find link repalcement
			const urlMatch = Webbrowser.matchURL(str);
			if (urlMatch) {
				wordLinkMap[urlMatch[0]] = urlMatch[0];
			}
			// find mention repalcement
			if (str.match(/\@[a-zA-Z0-9]+/g)) {
				wordMentionMap[str] = str;
			}
			// find highlight mentions
			if (
				user_login &&
				(str.toLocaleLowerCase() == user_login.toLocaleLowerCase() ||
					str.toLocaleLowerCase() == "@" + user_login.toLocaleLowerCase())
			) {
				wordMentionMap[str] = str;
				tagged = true;
			}
		});

		if (user_name.toLocaleLowerCase() == message.channel) {
			highlighted = true;
		}

		const getSubBadge = (version: number) => {
			if (channel_badges["subscriber"]) {
				return channel_badges["subscriber"].versions[version].image_url_2x;
			}
		};

		const renderEmote = (emoteInfo: any) => {
			return html`
				<span class="emote"
					><img
						emote
						service="${emoteInfo.service}"
						name="${emoteInfo.name}"
						alt="${emoteInfo.name}"
						src="${emoteInfo.emote.url_x2}"
						height="32"
				/></span>
			`;
		};

		const renderLink = (linkInfo: string) => {
			return html`<a
				class="inline-link"
				href="javascript:()"
				@click="${() => {
					Webbrowser.openInBrowwser(linkInfo);
				}}"
				>${linkInfo}</a
			> `;
		};

		const renderMention = (name: string) => {
			return html`<span class="mention">${name}</span> `;
		};

		// actually replace everything collected at once
		let parsed_msg = msg_words.map((word) => {
			// replace emotes
			if (wordEmoteMap[word]) {
				return renderEmote(wordEmoteMap[word]);
			}
			// replace links
			if (wordLinkMap[word]) {
				return renderLink(wordLinkMap[word]);
			}
			// replace mentions
			if (wordMentionMap[word]) {
				return renderMention(wordMentionMap[word]);
			}
			return word + " ";
		});

		let line_title = reward_id ? `Redeemed ${redemtion_title}.` : null;

		if (isReply) {
			const parent_message = this.channel.getMessageById(
				message.tags["reply-parent-msg-id"]
			);
			if (parent_message) {
				line_title = `${parent_message.user_name}: ${parent_message.text}`;
			}
		}

		// message footprint
		const msgFootprint = messageFootprint(message.message);

		const similarMessages = [];
		for (let [channel, id, footprint] of footprintMap) {
			if (footprint == msgFootprint && channel == message.channel) {
				similarMessages.push(id);
			}
		}

		messageCache.unshift([message.channel, message_id, message]);
		if (messageCache.length > 100) {
			messageCache.pop();
		}
		footprintMap.unshift([message.channel, message_id, msgFootprint]);
		if (footprintMap.length > 100) {
			footprintMap.pop();
		}

		let latestSimilarMessage: null | string = null;

		if (similarMessages.length > 0) {
			for (let messageId of similarMessages) {
				const [c, id, msg] = messageCache.find(
					([channel, id, _]) => id == messageId && channel == message.channel
				);
				latestSimilarMessage = id;
			}
		}

		// message html content
		const createLine = (mod = false) => {
			const lineEle = document.createElement("chat-line");

			if (action) {
				lineEle.setAttribute("action", "");
			}

			// TODO: Move the markup into the Chat component. Only render the actual message into a html version
			// TODO: Collpage exesively long messages, especially with emotes

			// render full message template
			const template = html`
				<style>
					[userid="${user_id}"] {
						--color: ${color};
					}
				</style>

				${line_title ? html` <div class="line-title">${line_title}</div> ` : ""}
				${mod &&
				user_name !== user_login &&
				!message.badges.find(
					(b) => b.id == "moderator" || b.id == "broadcaster"
				)
					? html`
							<span
								class="chat-line-tool mod-tool inline-tool"
								title="Timeout 10s"
								@click="${() =>
									this.channel.timeout(message.channel, message.name, 10)}"
							>
								<img
									src="./images/block_white_24dp.svg"
									width="16px"
									height="16px"
								/>
							</span>
							<span
								class="chat-line-tool mod-tool inline-tool delete-tool"
								title="Delete Message"
								@click="${() =>
									this.channel.deleteMessage(message.channel, message.id)}"
							>
								<img
									src="./images/delete_white_24dp.svg"
									width="16px"
									height="16px"
								/>
							</span>
							<span
								class="chat-line-tool inline-tool mod-tool-deleted"
								title="Unban"
								@click="${() =>
									this.channel.unban(message.channel, message.name)}"
							>
								<img
									src="./images/done_white_24dp.svg"
									width="16px"
									height="16px"
								/>
							</span>
					  `
					: ""}
				<span class="bages">
					${message.badges.map((badge) => {
						let badge_url = "";

						if (badge.id == "subscriber") {
							badge_url =
								getSubBadge(badge.version) ||
								Badges.getBadgeByName(badge.id, badge.version);
							return html`<img
								class="badge"
								alt="${badge.id} (${message.badgeInfo})"
								src="${badge_url}"
								width="18"
								height="18"
							/>`;
						}

						badge_url = Badges.getBadgeByName(badge.id, badge.version);
						return html`<img
							class="badge"
							alt="${badge.id}"
							src="${badge_url}"
							width="18"
							height="18"
						/>`;
					})}
				</span>
				<span
					class="username"
					@click="${() => this.channel.openUserCard(message.name)}"
					>${message.name}:</span
				>
				${isReply && false
					? html`
							<button class="reply-icon" title="Reply">
								<img
									src="./images/question_answer_white_24dp.svg"
									height="18px"
									width="18px"
								/>
							</button>
					  `
					: ""}
				<span class="message">${parsed_msg}</span>

				${message.name !== user_login
					? html`
							<div
								class="tool chat-line-tool"
								title="Reply"
								@click="${() => this.channel.reply(message.channel, message)}"
							>
								<img
									src="./images/reply_white_24dp.svg"
									height="18px"
									width="18px"
								/>
							</div>
					  `
					: ""}
			`;

			lineEle.setAttribute("messageid", message.id);
			lineEle.setAttribute("userid", message.userId);

			if (tagged) {
				lineEle.setAttribute("tagged", "");
			}
			if (highlighted) {
				lineEle.setAttribute("highlighted", "");
			}
			if (action) {
				lineEle.setAttribute("action", "");
			}

			lineEle.message = messageData;

			render(template, lineEle);

			if (latestSimilarMessage != null) {
				// TODO: append this new message to the old one, dont add it to the chat
				lineEle.setAttribute("compact", "");
			}

			return lineEle;
		};

		const messageData: ChatMessage = {
			type: "message",
			id: message.id,
			user_name: message.name,
			user_id: message.userId,
			highlighted: highlighted,
			tagged: tagged,
			action: action,
			reply: isReply,
			timestamp: timestamp,
			text: message.message,
			content: createLine,
		};

		return messageData;
	}
}

function messageFootprint(msgString: string) {
	const words = new Set([...msgString.split(" ")]);
	// const words = new Set([...msgString.split(" ").filter(w => w.length > 1)]);
	const str = [...words].join("");

	let footprint = "XXXXXXXXXXXXXXXXXXXXXXXX";

	for (let i = 0; i < footprint.length; i++) {
		const charIndex = Math.floor((i / footprint.length) * str.length);
		const char = str[charIndex];
		footprint = footprint.substring(0, i) + char + footprint.substring(i + 1);
	}

	return footprint;
}
