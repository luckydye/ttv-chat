import { TwitchChat } from "twitch";

let chat = new TwitchChat();
let logged_in = false;

chat.onMessage(async (evnt) => {
	if (!logged_in) {
		logged_in = true;
		for (let channel of channels) {
			eventhandlers["irc.join"]({ channel: channel });
		}
	}

	self.clients.matchAll().then((clients) => {
		for (let client of clients) {
			client.postMessage({ type: "irc.message", message: evnt.detail });
		}
	});
});

const channels: string[] = [];

const eventhandlers = {
	"irc.send"({ channel, message }) {
		console.log("Send message!", channel, message);
		if (logged_in) {
			chat.send(channel, message);
		}
	},
	"irc.join"({ channel }) {
		if (!logged_in) {
			channels.push(channel);
		} else {
			console.log("Join channel!", channel);
			chat.join(channel);
		}
	},
	"irc.login"({ login, token }) {
		console.log("login!", login, token);
		chat.connect(login, token);
	},
};

self.addEventListener("message", (event) => {
	const type = event.data.type;
	const handler = eventhandlers[type];
	if (handler) {
		const result = eventhandlers[type](event.data);
		if (result) {
			event.source?.postMessage(result);
		}
	}
});
