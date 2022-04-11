import Format from './Format';

export function generateNonce(length = 30) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

const reward_listeners: Set<Function> = new Set();
const mod_action_listeners: Set<Function> = new Set();
const poll_listeners: Set<Function> = new Set();
const hype_train_listeners: Set<Function> = new Set();
const unhandled_listeners: Set<Function> = new Set();

interface Reward {
	reward_id: string;
	channel_id: string;
	cost: number;
	timestamp: number;
	user_id: string;
	user_name: string;
	title: string;
	image_url: string;
}

const request_nonce_map = {};

export default class TwitchPubsub {
	pubsub_url: string = 'wss://pubsub-edge.twitch.tv';
	access_token: string;

	rewards: { [key: string]: Reward } = {};

	socket: WebSocket;

	constructor(oauth_token: string) {
		this.access_token = oauth_token;

		if (!oauth_token) {
			throw new Error('not logged in, can not connect to pubsub.');
		}
	}

	loadRedemtionHistory() {
		const redemtion_history = localStorage.getItem('redemtion-hisotry');
		if (redemtion_history) {
			this.rewards = JSON.parse(redemtion_history);
		}
	}

	saveRedemtionHistory() {
		localStorage.setItem('redemtion-hisotry', JSON.stringify(this.rewards));
	}

	queuePing() {
		setTimeout(() => {
			this.socket.send(JSON.stringify({ type: 'PING' }));
			// reconnect if there is no PONG in the next 10 seconds
		}, 1000 * 60 * (4 + Math.random()));
	}

	reconnect() {
		console.log('reconnecting...');

		setTimeout(() => {
			this.connect();
		}, 1000);
	}

	async connect() {
		return new Promise((resolve, reject) => {
			console.log('Connecting to pubsub');

			this.socket = new WebSocket(this.pubsub_url);

			this.socket.addEventListener('message', ({ data }) => {
				const json = JSON.parse(data);

				if (json.error) {
					console.error('Error', json.error);
					return;
				}
				if (json.type === 'PONG') {
					console.log('PONG');
					this.queuePing();
					return;
				}
				if (json.type === 'RECONNECT') {
					console.log('RECONNECT');
					this.reconnect();
					return;
				}
				if (json.type === 'RESPONSE') {
					if (json.error != '') {
						console.log('pubsub error response', json);
					} else {
						for (let topic of request_nonce_map[json.nonce]) {
							console.log('sucessfull listen on', topic);
						}
						delete request_nonce_map[json.nonce];
					}
				}
				if (json.type === 'MESSAGE') {
					const messageData = JSON.parse(json.data.message);
					this.handlePubsubMessage(messageData);
				}
			});

			this.socket.addEventListener('open', (e) => {
				this.queuePing();
				resolve(true);
			});
			this.socket.addEventListener('error', (e) => {
				reject();
			});
			this.socket.addEventListener('close', (e) => {
				this.reconnect();
			});
		});
	}

	listen(topics: Array<string>) {
		const nonce = generateNonce();
		const request = {
			type: 'LISTEN',
			nonce: nonce,
			data: {
				topics: topics,
				auth_token: this.access_token
			}
		};
		request_nonce_map[nonce] = topics;
		this.socket.send(JSON.stringify(request));
	}

	onRedemtion(callback: Function) {
		reward_listeners.add(callback);
		return () => reward_listeners.delete(callback);
	}

	onModAction(callback: Function) {
		mod_action_listeners.add(callback);
		return () => mod_action_listeners.delete(callback);
	}

	onHypeTrain(callback: Function) {
		hype_train_listeners.add(callback);
		return () => hype_train_listeners.delete(callback);
	}

	onUnhandled(callback: Function) {
		unhandled_listeners.add(callback);
		return () => unhandled_listeners.delete(callback);
	}

	handlePubsubMessage(message: any) {
		switch (message.type) {
			case 'reward-redeemed':
				this.handleRedemtionMessage(message);
				break;
			case 'moderation_action':
				this.handleModActionMessage(message);
				break;
			case 'hype-train-start':
				this.handleHypeTrainMessage(message);
				break;
			case 'POLL_COMPLETE':
			case 'POLL_UPDATE':
			case 'POLL_CREATE':
				this.handlePollMessage(message);
				break;
			default:
				console.log('Uunhandled pubsub message', message.type);
				console.log(message);
		}

		if (message.type) {
			this.handleUnhandledMessage(message);
		}
	}

	handleUnhandledMessage(message: any): void {
		this.emitForListeners(unhandled_listeners, {
			message
		});
	}

	handleHypeTrainMessage(message: any) {
		const channel_id = message.data.channel_id;
		const level = message.data.progress.level.value;
		const started_at = message.data.started_at;
		const expires_at = message.data.expires_at;

		this.emitForListeners(hype_train_listeners, {
			channel_id,
			level,
			started_at,
			expires_at
		});
	}

	handlePollMessage(message: any) {
		const poll = message.data.poll;
		const title = poll.title;
		const started_at = poll.started_at;
		const duration = poll.duration_seconds;
		const options = poll.choices;

		switch (message.type) {
			case 'POLL_CREATE':
				this.emitForListeners(poll_listeners, {
					title,
					started_at,
					duration,
					options
				});
				break;
			case 'POLL_UPDATE':
				break;
			case 'POLL_COMPLETE':
				break;
		}
	}

	handleRedemtionMessage(message: any) {
		const data = message.data;
		const redemtion = data.redemption;

		const channel_id = redemtion.channel_id;
		const ts = redemtion.redeemed_at;
		const user_id = redemtion.user.id;
		const user_name = redemtion.user.display_name;
		const reward = redemtion.reward;
		const reward_id = reward.id;
		const cost = reward.cost;
		const title = reward.title;
		const image_url = reward.image?.url_2x || reward.default_image.url_2x;

		const reward_data: Reward = {
			reward_id,
			channel_id,
			cost,
			timestamp: ts,
			user_id,
			user_name,
			title,
			image_url
		};

		this.emitForListeners(reward_listeners, reward_data);

		this.rewards[reward_data.reward_id] = reward_data;
		this.saveRedemtionHistory();
	}

	handleModActionMessage(message: any) {
		const data = message.data;

		const action = data.moderation_action;
		switch (action) {
			case 'timeout': {
				const mod_user = data.created_by;
				const [target_user, time] = data.args;

				this.emitForListeners(mod_action_listeners, {
					action: action,
					message: `${mod_user} timed out ${target_user} for ${Format.seconds(time)}.`
				});
				break;
			}
			case 'untimeout': {
				const mod_user = data.created_by;
				const [target_user] = data.args;

				this.emitForListeners(mod_action_listeners, {
					action: action,
					message: `${mod_user} remove the timeout for ${target_user}.`
				});
				break;
			}
			default:
				console.log('unhandled mod action', message);
		}
	}

	emitForListeners(listeners: Set<Function>, data: any) {
		for (let listener of listeners) {
			listener(data);
		}
	}
}
