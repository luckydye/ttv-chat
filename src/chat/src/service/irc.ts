import { TwitchChat } from "twitch";

let chat = new TwitchChat();

function initPort(port) {
	let logged_in = false;

	chat.onMessage(async (data) => {
		if (!logged_in) {
			logged_in = true;
			for (let channel of channels) {
				eventhandlers["irc.join"]({ channel: channel });
			}
		}

		port.postMessage({ type: "irc.message", message: data });
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

	port.addEventListener("message", (event) => {
		const type = event.data.type;
		const handler = eventhandlers[type];
		if (handler) {
			const result = eventhandlers[type](event.data);
			if (result) {
				event.source?.postMessage(result);
			}
		}
	});
}

self.onconnect = function (e) {
	const port = e.ports[0];

	console.log("new connection");

	initPort(port);

	port.start();
};
