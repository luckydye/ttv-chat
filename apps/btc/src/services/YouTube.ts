export default class YouTubeApi {
	// https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCyyFjmnG3-kgnlc1Pdn0VyWAqjvnzUFYo&

	static async getVideo(video_id: string) {
		const key = 'AIzaSyCyyFjmnG3-kgnlc1Pdn0VyWAqjvnzUFYo';
		const url = `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${video_id}&part=snippet,statistics`;
		return fetch(url)
			.then((res) => res.json())
			.then((json) => {
				return json.items[0];
			});
	}
}
