import IRC from "./services/IRC";
import { UserInfo } from './services/twitch/Api';

export default class Account {

    // holds information for the logged in user
    // acounts are persistent, and are optionaly authenticated.

    user_login: string;
    user_id: string;

    constructor(user_info: UserInfo) {
        this.user_login = user_info.login;
        this.user_id = user_info.id;

        IRC.connectoToChat(username, token).then(() => {

        })
    }

}