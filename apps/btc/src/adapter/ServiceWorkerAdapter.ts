export class ServiceWorkerAdapter {
	get worker() {
		// TODO: handle if worker not available
		return navigator.serviceWorker.controller;
	}

	joinChannel(channel: string) {
		this.worker?.postMessage({
			type: 'irc.join',
			channel
		});
	}

	sendMessage(channel: string, message: string) {
		this.worker?.postMessage({
			type: 'irc.send',
			channel,
			message
		});
	}

	onMessage(callback: (msg) => void) {
		navigator.serviceWorker.addEventListener('message', (msg) => {
			callback(msg.data);
		});
	}

	login(login: string, token: string) {
		this.worker?.postMessage({
			type: 'irc.login',
			login,
			token
		});
	}
}
