const worker = new SharedWorker(
	new URL("./../service/irc.ts", import.meta.url),
	{
		type: "module",
	}
);

worker.onerror = console.error;
worker.port.start();

export class ServiceWorkerAdapter {
	get worker() {
		// TODO: handle if worker not available
		return worker;
	}

	joinChannel(channel: string) {
		this.worker?.port.postMessage({
			type: "irc.join",
			channel,
		});
	}

	sendMessage(channel: string, message: string) {
		this.worker?.port.postMessage({
			type: "irc.send",
			channel,
			message,
		});
	}

	onMessage(callback: (msg) => void) {
		this.worker?.port.addEventListener("message", (msg) => {
			callback(msg.data);
		});
	}

	login(login: string, token: string) {
		this.worker?.port.postMessage({
			type: "irc.login",
			login,
			token,
		});
	}
}
