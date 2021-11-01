import { generateNonce } from '../../utils';

const reward_listeners: Set<Function> = new Set();

interface Reward {
    reward_id: string,
    channel_id: string,
    cost: number,
    timestamp: number,
    user_id: string,
    user_name: string,
    title: string,
    image_url: string
}

export default class TwitchPubsub {

    pubsub_url: string = 'wss://pubsub-edge.twitch.tv';
    access_token: string;

    rewards: { [key: string]: Reward } = {};

    socket: WebSocket;

    constructor(oauth_token: string) {
        this.access_token = oauth_token;

        const token = localStorage.getItem('user-token');
        if(!token) {
            throw new Error('not logged in, can not connect to pubsub.');
        }
    }

    loadRedemtionHistory() {
        const redemtion_history = localStorage.getItem('redemtion-hisotry');
        if(redemtion_history) {
            this.rewards = JSON.parse(redemtion_history);
        }
    }

    saveRedemtionHistory() {
        localStorage.setItem('redemtion-hisotry', JSON.stringify(this.rewards));
    }

    queuePing() {
        setTimeout(() => {
            this.socket.send(JSON.stringify({ type: "PING" }));
            // reconnect if there is no PONG in the next 10 seconds
        }, 1000 * 60 * (4 + Math.random()));
    }

    reconnect() {
        // TODO: reconnect
    }

    async connect() {
        return new Promise((resolve, reject) => {
            console.log('Connecting to pubsub');

            this.socket = new WebSocket(this.pubsub_url);
        
            this.socket.addEventListener('message', ({ data }) => {
                const json = JSON.parse(data);

                if(json.error) {
                    console.error('Error', json.error);
                    return;
                }
                if(json.type === "PONG") {
                    console.log('PONG');
                    this.queuePing();
                    return;
                }
                if(json.type === "RECONNECT") {
                    console.log('RECONNECT');
                    this.reconnect();
                    return;
                }
                if(json.type === "RESPONSE") {
                    // console.log('pubsub response', json);
                }
                if(json.type === "MESSAGE") {
                    const messageData = JSON.parse(json.data.message);
                    this.handlePubsubMessage(messageData);
                }
            });

            this.socket.addEventListener('open', e => {
                this.queuePing();
                resolve(true);
            });
            this.socket.addEventListener('error', e => {
                reject();
            });
        })
    }

    listen(topics: Array<string>) {        
        const nonce = generateNonce();
        const request = {
            "type": "LISTEN",
            "nonce": nonce,
            "data": {
                "topics": topics,
                "auth_token": this.access_token
            }
        }
        this.socket.send(JSON.stringify(request));
    }

    onRedemtion(callback: Function) {
        reward_listeners.add(callback);
        return () => reward_listeners.delete(callback);
    }

    handlePubsubMessage(message: any) {
        switch(message.type) {
            case "reward-redeemed":
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

                this.handleRedemtionMessage(reward_data);
                this.saveRedemtionHistory();
                break;
            default:
                console.log('Uunhandled pubsub message', message.type);
                
        }
    }

    handleRedemtionMessage(reward_data: any) {
        for (let listener of reward_listeners) {
            listener(reward_data);
        }
        this.rewards[reward_data.reward_id] = reward_data;
    }

}