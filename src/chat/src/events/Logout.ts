import AppEvent from "./AppEvent";

export default class LogoutEvent extends AppEvent {
	data: { id: string };

	constructor(user_id: string) {
		super("app-logout");
		this.data = {
			id: user_id,
		};
	}
}
