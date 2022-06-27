const worker = new Worker(new URL("./../modules/chat.ts", import.meta.url), {
	type: "module",
});

worker.onerror = console.error;

export class ServiceWorkerAdapter {
	get worker() {
		// TODO: handle if worker not available
		return worker;
	}

	joinChannel(channel: string) {
		this.worker?.postMessage({
			type: "irc.join",
			channel,
		});
	}

	sendMessage(channel: string, message: string) {
		this.worker?.postMessage({
			type: "irc.send",
			channel,
			message,
		});
	}

	onMessage(callback: (msg) => void) {
		this.worker?.addEventListener("message", (msg) => {
			callback(msg.data);
		});
	}

	login(login: string, token: string) {
		this.worker?.postMessage({
			type: "irc.login",
			login,
			token,
		});
	}
}
