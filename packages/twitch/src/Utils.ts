interface SearchParams {
	[key: string]: string;
}

export class URI {
	static parseSearch(str: string = '', res: SearchParams = {}) {
		str
			.substring(1)
			.split('&')
			.map((item) => item.split('='))
			.forEach((item) => {
				res[item[0]] = unescape(item[1]);
			});
		return res;
	}

	static matchURL(str: string) {
		return str.match(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
		);
	}
}
