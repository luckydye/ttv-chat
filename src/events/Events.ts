export default {
    ChannelCreated: "app-channel-created",
    ChannelMoved: "app-channel-moved",
    ChannelRemoved: "app-channel-removed",
    ChannelSelected: "app-channel-selected",
    ChannelInfoChanged: "app-channel-changed",
    ChannelStateChanged: "app-channel-state-changed",
    Login: "app-login",
    Logout: "app-logout",
    Initialize: "app-initialize",
}

export function on(eventOrEventArray: string | Array<string>, callback: EventListenerOrEventListenerObject) {
    if(eventOrEventArray instanceof Array) {
        for(let event of eventOrEventArray) {
            window.addEventListener(event, callback);
        }
    } else {
        window.addEventListener(eventOrEventArray, callback);
    }
}