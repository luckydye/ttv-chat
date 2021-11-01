export default class LinkPreview {

    static async generate(url: string) {
        const urlInstance = new URL(url);
        console.log(urlInstance.host);

        // TODO: make link preview for known origins

        // youtube
        const api_key = "AIzaSyCyyFjmnG3-kgnlc1Pdn0VyWAqjvnzUFYo";
        const video_id = "TcS05DPojIU";
        // https://www.googleapis.com/youtube/v3/videos?key=${api_key}&id=${video_id}&part=snippet,statistics
    }

}
