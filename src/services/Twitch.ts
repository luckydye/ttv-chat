// import jwt from 'jsonwebtoken';
import Webbrowser from '../Webbrowser';
import IRCChatClient from './IRCChatClient';
import TwichCommands from './twitch/TwichCommands';
import TwitchPubsub from './twitch/Pubsub';

const CLIENT_ID = "8gwe8mu523g9cstukr8rnnwspqjykf";
const REDIRECT_URI = "https://best-twitch-chat.web.app/auth";

let logged_in_username = "";
let logged_in_user = {};
let logged_in = false;


// TODO: Contain all these loose functions into the TwitchAPI class

function connectToChatServer(username: string, token: string) {
    try {
        console.log('connecting');

        IRCChatClient.connectoToChat(username, token).then(() => {
            window.dispatchEvent(new Event("loggedin"));
        })
    } catch (err) {
        console.error('Error opening chat', err);
    }
}

export async function handleAuthenticatedUser(token: string) {
    const userinfo = await fetchTwitchAuthApi("/oauth2/userinfo", token);
    const username = userinfo.preferred_username;

    console.log('Login', username);
    if (username == null) {
        localStorage.removeItem('user-token');
        logged_in = false;
        return;
    } else {
        localStorage.setItem('user-token', token);
        logged_in = true;
    }

    connectToChatServer(username, token);
}

export async function getLoggedInUser() {
    const token = localStorage.getItem('user-token');
    const userinfo = await fetchTwitchAuthApi("/oauth2/userinfo", token);
    logged_in_username = userinfo.preferred_username;
    const user_data = await TwitchAPI.getUserInfo(logged_in_username);
    logged_in_user = user_data;
    return userinfo;
}

export function getLoggedInUsername() {
    return logged_in_username;
}

export async function getUserInfo(user_login: string) {
    const userinfo = await fetchTwitchApi("/users", `login=${user_login}`);
    const user = userinfo.data[0];
    const stream = await TwitchAPI.getStreams(user.id);
    const data = user;
    data.stream = stream[0];
    return data;
}

function fetchTwitchAuthApi(path: string = "/oauth2/userinfo", token: string) {
    const url = `https://id.twitch.tv${path}`;
    return fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .catch(err => {
            console.error(err);
        })
}

export function fetchTwitchApi(path: string = "/users", query = "") {
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

export function checLogin() {
    if (localStorage.getItem('user-token') && !logged_in) {
        const token = localStorage.getItem('user-token');
        handleAuthenticatedUser(token);
        return true;
    }
    return false;
}

export async function authClientUser() {


    // check if already logged in
    if (checLogin()) {
        return;
    }

    // else start auth process
    const type = "token+id_token";
    const scopes = [
        "channel:edit:commercial",
        "channel:manage:polls",
        "channel:manage:predictions",
        "channel:manage:redemptions",
        "channel:read:hype_train",
        "channel:read:polls",
        "channel:read:predictions",
        "channel:read:redemptions",
        "moderation:read",
        "user:manage:blocked_users",
        "user:read:blocked_users",

        "bits:read",
        "channel:moderate",
        "chat:read",
        "chat:edit",
        "whispers:read",

        "openid"
    ];

    const claims = {
        "userinfo": {
            "preferred_username": null
        }
    };

    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&response_type=${type}` +
        `&scope=${scopes.join("%20")}` +
        `&claims=${JSON.stringify(claims)}`;

    const win = open(url);

    if (win) {
        win.addEventListener('load', e => {
            console.log("win load event", win);

            const params = win.location.hash;
            const parsed = Webbrowser.parseSearch(params);

            const access_token = parsed.access_token;
            handleAuthenticatedUser(access_token);

            win.close();
        })
    } else {
        throw new Error('could not open authentication window');
    }
}

let twitch_pubsub: TwitchPubsub;

export default class TwitchAPI {

    static get pubsub() {
        return twitch_pubsub;
    }

    static getCurrentUser() {
        return logged_in_user;
    }

    static async getUserInfo(user_login: string) {
        const userinfo = await fetchTwitchApi("/users", `login=${user_login}`);
        return userinfo.data[0];
    }

    static async getCustomReward(user_id: string) {
        const userinfo = await fetchTwitchApi("/channel_points/custom_rewards", `broadcaster_id=${user_id}`);
        return userinfo;
    }

    static async requestMessageHistory() {
        
    }

    static findReward(id: string) {
        if(twitch_pubsub) {
            return twitch_pubsub.rewards[id];
        }
    }

    static async connectToPubSub(): Promise<TwitchPubsub> {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('user-token');
            if (token) {
                const pubsub = new TwitchPubsub(token);
                twitch_pubsub = pubsub;

                pubsub.connect()
                    .then(() => {
                        resolve(pubsub);
                    })
                    .catch(err => {
                        reject(err);
                    })

                // `channel-points-channel-v1.${channel_id}`,
                // // seperate connections for mod stuff. Have a single connection with the max 50 topics for all chats.
                // `automod-queue.${user_id}.${channel_id}`,
                // `chat_moderator_actions.${user_id}.${channel_id}`,
                // `user-moderation-notifications.${user_id}.${channel_id}`,
            } else {
                throw new Error('not logged in, can not connect to pubsub.');
            }
        })
    }

    static logout() {
        localStorage.removeItem('user-token');
        location.reload();
    }

    static async getStreams(user_id: string) {
        return (await fetchTwitchApi("/streams", "user_id=" + user_id)).data;
    }

    static async getChannel(user_id: string) {
        return (await fetchTwitchApi("/channels", "broadcaster_id=" + user_id)).data;
    }

    static getAvailableCommands() {
        return TwichCommands;
    }

}