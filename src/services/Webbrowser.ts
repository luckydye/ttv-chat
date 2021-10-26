import { invoke } from '@tauri-apps/api/tauri';

export default class Webbrowser {

    static openURL(url) {
        invoke("open_link", { url });
    }

}