import TwichCommands from './TwichCommands';
import TwitchPubsub from './Pubsub';

const CLIENT_ID = "8gwe8mu523g9cstukr8rnnwspqjykf";
const REDIRECT_URI = "https://best-twitch-chat.web.app/auth";

// "/users" reference from twitch api
export interface UserInfo {
    id: string,
    login: string,
    display_name: string,
    type: string,
    broadcaster_type: string,
    description: string,
    profile_image_url: string,
    offline_image_url: string,
    view_count: number,
    email: string,
    created_at: string
}

export default class TwitchApi {

    static get CLIENT_ID() {
        return CLIENT_ID;
    }

    static get REDIRECT_URI() {
        return REDIRECT_URI;
    }

    static async fetch(path: string = "/users", query = "") {
        const token = localStorage.getItem('user-token');
        const url = `https://api.twitch.tv/helix${path}?${query}&client_id=${CLIENT_ID}`;
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Client-Id': CLIENT_ID
            }
        })
            .then(res => res.json())
            .catch(err => {
                console.error(err);
            })
    }

    static async getUserInfo(user_login: string): Promise<UserInfo | undefined> {
        const userinfo = await this.fetch("/users", `login=${user_login}`);
        return userinfo.data[0];
    }

    static async getCustomReward(user_id: string) {
        const userinfo = await this.fetch("/channel_points/custom_rewards", `broadcaster_id=${user_id}`);
        return userinfo;
    }

    static async requestMessageHistory() {

    }

    static async connectToPubSub(): Promise<TwitchPubsub> {
        const token = localStorage.getItem('user-token');
        if (token) {
            const pubsub = new TwitchPubsub(token);
            return pubsub.connect().then(() => pubsub);
        } else {
            throw new Error('not logged in, can not connect to pubsub.');
        }
    }

    static logout() {
        localStorage.removeItem('user-token');
        location.reload();
    }

    static async getStreams(user_id: string) {
        return (await this.fetch("/streams", "user_id=" + user_id)).data;
    }

    static async getChannel(user_id: string) {
        return (await this.fetch("/channels", "broadcaster_id=" + user_id)).data;
    }

    static getAvailableCommands() {
        return TwichCommands;
    }

}