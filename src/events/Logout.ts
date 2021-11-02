import Events from './Events';

export default class LogoutEvent extends Event {

    data: { id: string };

    constructor(user_id: string) {
        super(Events.Logout);
        this.data = {
            id: user_id
        }
    }

}