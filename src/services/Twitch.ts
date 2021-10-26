// import jwt from 'jsonwebtoken';
import { parseSearch } from '../utils';
import IRCChatClient from './IRCChatClient';

const CLIENT_ID = "8gwe8mu523g9cstukr8rnnwspqjykf";
const REDIRECT_URI = "https://luckydye.de/auth";

window.addEventListener('load', e => {
    checLogin();
})

function openChat(username: string, token: string) {
    info("Pull chat.");
    try {
        console.log('connecting');
        
        IRCChatClient.connectoToChat(username, token);
    } catch (err) {
        info(err);
    }
}

export function joinChannel(channel: string) {
    console.log('Joining channel');
    IRCChatClient.joinChatRoom(channel);
}

export async function handleAuthenticatedUser(token: string) {
    const userinfo = await fetchTwitchAuthApi("/oauth2/userinfo", token);
    const username = userinfo.preferred_username;

    console.log(username);
    if (username == null) {
        info("Token invalid.");
        localStorage.removeItem('user-token');
        return;
    } else {
        localStorage.setItem('user-token', token);
    }

    info("Logged in.");
    openChat(username, token);
}

export async function getLoggedInUser() {
    const token = localStorage.getItem('user-token');
    const userinfo = await fetchTwitchAuthApi("/oauth2/userinfo", token);
    return userinfo;
}

export async function getUserInfo(user_login: string) {
    const userinfo = await fetchTwitchApi("/users", `login=${user_login}`);
    return userinfo.data[0];
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
    if (localStorage.getItem('user-token')) {
        info("Found token.");
        const token = localStorage.getItem('user-token');
        handleAuthenticatedUser(token);
        return true;
    }
    return false;
}

function info(str) {
    const nots = document.querySelector('notification');
    nots.innerHTML += str + "\n";
}

export async function authClientUser() {

    info("Logging in.");

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
        "channel:read:redemptions",
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

    const win = window.open(url);

    if (win) {
        win.addEventListener('load', e => {
            console.log("win load event", win);

            const params = win.location.hash;
            const parsed = parseSearch(params);

            const access_token = parsed.access_token;
            handleAuthenticatedUser(access_token);

            console.log('token', access_token);
            win.close();
        })
    } else {
        throw new Error('could not open authentication window');
    }
}
