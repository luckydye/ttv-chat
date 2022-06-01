import { generateNonce } from './nonce';
import { parse } from './irc-message';

type TwitchMessage = {
	author: string;
	tags: Record<string, string | true>;
	command: string;
	message: string;
};

export class TwitchChat {
	authenticated = false;

	ws!: WebSocket;

	channels: Set<string> = new Set();

	connect(login: string, token: string): Promise<void> {
		return new Promise((resolve) => {
			this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv/');

			this.ws.onerror = (err) => {
				console.error('Chat Service Error', err);

				setTimeout(() => {
					this.connect(login, token);
					for (const channel of this.channels) {
						this.join(channel);
					}
				}, 1000);
			};

			this.ws.onopen = () => {
				console.log('Chat Connection Open');

				if (!this.authenticated) {
					this.ws.send(`PASS oauth:${token}`);
					this.ws.send(`NICK ${login}`);
				}

				resolve();
			};

			this.ws.onmessage = (msg) => {
				globalThis.dispatchEvent(new CustomEvent('twitch-chat-message', { detail: msg.data }));
			};
		});
	}

	onMessage(callback: (msg: TwitchMessage) => void) {
		globalThis.addEventListener('twitch-chat-message', ((ev: CustomEvent) => {
			const msg = parse(ev.detail as string);

			if (msg && msg.prefix) {
				switch (msg.command) {
					case 'PRIVMSG':
						callback({
							author: msg.prefix.split('!')[0],
							tags: msg.tags,
							command: msg.command,
							message: msg.params[1].replace(/\r\n?/g, '')
						});
						break;
				}
			}
		}) as EventListener);
	}

	send(channel: string, text: string) {
		this.ws.send(`@client-nonce=${generateNonce()} PRIVMSG #${channel} :${text}`);
	}

	async join(channel: string): Promise<void> {
		await this.ws.send(`JOIN #${channel}`);
		console.log(`Joined channel ${channel}`);
		this.channels.add(channel);
	}
}
