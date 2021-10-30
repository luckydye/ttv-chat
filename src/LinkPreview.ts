export default class LinkPreview {

    static async generate(url: string) {
        const urlInstance = new URL(url);
        console.log(urlInstance.host);

        // TODO: make link preview for known origins
    }

}
