import { generateNonce } from "./nonce";

export class TwitchChat {
	static async requestHistory(channel) {
		return await fetch(`https://twitch-chat-history.deno.dev/${channel}`).then(
			(res) => res.json()
		);
	}

	authenticated = false;

	ws!: WebSocket;

	channels: Set<string> = new Set();

	connect(login: string, token: string): Promise<void> {
		return new Promise((resolve) => {
			this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv/");

			this.ws.onerror = (err) => {
				console.error("Chat Service Error", err);

				setTimeout(() => {
					this.connect(login, token);
					for (const channel of this.channels) {
						this.join(channel);
					}
				}, 1000);
			};

			this.ws.onopen = () => {
				console.log("Chat Connection Open");

				if (!this.authenticated) {
					this.ws.send(`CAP REQ :twitch.tv/tags twitch.tv/commands`);
					this.ws.send(`PASS oauth:${token}`);
					this.ws.send(`USER ${login} 8 * :${login}`);
					this.ws.send(`NICK ${login}`);
				}

				resolve();
			};

			this.ws.onmessage = (msg) => {
				globalThis.dispatchEvent(
					new CustomEvent("twitch-chat-message", { detail: msg.data })
				);
			};
		});
	}

	onMessage(callback: (msg: string) => void) {
		globalThis.addEventListener("twitch-chat-message", ((ev: CustomEvent) => {
			callback(ev.detail as string);
		}) as EventListener);
	}

	send(channel: string, text: string) {
		this.ws.send(
			`@client-nonce=${generateNonce()} PRIVMSG #${channel} :${text}`
		);
	}

	async join(channel: string): Promise<void> {
		await this.ws.send(`JOIN #${channel}`);

		console.log(`Joined channel ${channel}`);
		this.channels.add(channel);

		const history = await TwitchChat.requestHistory(channel);
		if (history.messages) {
			for (let msg of history.messages) {
				globalThis.dispatchEvent(
					new CustomEvent("twitch-chat-message", { detail: msg })
				);
			}
		}
	}
}
