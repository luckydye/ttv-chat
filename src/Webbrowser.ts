import { invoke } from '@tauri-apps/api/tauri';

export default class Webbrowser {

    static matchURL(str: string) {
        return str.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g);
    }

    static openInBrowwser(url: string) {
        invoke("open_link", { url });
    }

}