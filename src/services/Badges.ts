let global_badges: { [key: string]: any } = {};
let channel_badges: { [key: string]: any } = {};

export default class Badges {

    static getBadgeByName(name: string, version: number) {
        const badge = global_badges[name];
        if(badge.versions[version]) {
            return badge.versions[version].image_url_2x;
        } else {
            return badge.versions[Object.keys(badge.versions)[0]].image_url_2x;
        }
    }

    static getChachedChannelBadges(channel_id: string) {
        if (!channel_badges[channel_id]) {
            channel_badges[channel_id] = {};
            Badges.getChannelBadges(channel_id);
        }
        return channel_badges[channel_id];
    }

    static async getChannelBadges(channel_id: string) {
        if(!channel_id) return;
        
        return fetch(`https://badges.twitch.tv/v1/badges/channels/${channel_id}/display`)
            .then(res => res.json())
            .then(json => {
                channel_badges[channel_id] = json.badge_sets;
                return json.badge_sets;
            })
            .catch(err => {
                console.error(err);
            })
    }

    static async getGlobalBadges() {
        return fetch("https://badges.twitch.tv/v1/badges/global/display")
            .then(res => res.json())
            .then(json => {
                global_badges = json.badge_sets;
            })
            .catch(err => {
                console.error(err);
            })
    }

}
