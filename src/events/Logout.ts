export default class LogoutEvent extends Event {

    data: { id: string };

    constructor(user_id: string) {
        super('app-logout');
        this.data = {
            id: user_id
        }
    }

}