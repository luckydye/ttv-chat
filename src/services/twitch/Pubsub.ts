import { generateNonce } from '../../utils';

export default class TwitchPubsub {

    pubsub_url: string = 'wss://pubsub-edge.twitch.tv';
    access_token: string;

    socket: WebSocket;

    constructor(oauth_token: string) {
        this.access_token = oauth_token;

        const token = localStorage.getItem('user-token');
        if(!token) {
            throw new Error('not logged in, can not connect to pubsub.');
        }
    }

    queuePing() {
        setTimeout(() => {
            this.socket.send(JSON.stringify({ type: "PING" }));
            // reconnect if there is no PONG in the next 10 seconds
        }, 1000 * 60 * (4 + Math.random()));
    }

    reconnect() {
        // reconnect
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
                    console.log('pubsub response', json);
                }
                if(json.type === "MESSAGE") {
                    console.log('pubsub msg', json);
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
        console.log('Listen', topics);
        
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

}