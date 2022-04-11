export default class Notifications {
	static initialize() {
		// request user grant to show notification
		return Notification.requestPermission(function (result) {
			return result;
		});
	}

	static send(text: string) {
		const icon = './images/icon.png';
		const options = {
			title: text,
			body: null,
			icon: icon
		};
		console.warn('notification', options);
	}
}
