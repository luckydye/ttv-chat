import Webbrowser from "../Webbrowser";
import TwitchApi from "../services/twitch/Api";
import { html } from 'lit-element';

async function renderTwitchClip(clipId: string) {
    const clips = await TwitchApi.getClip(clipId);
    const clip = clips[0];

    return html`
        <div class="clip-thumbnail">
            <img src="${clip.thumbnail_url}" width="180px"/>
        </div>
        <div class="clip-title">${clip.title}</div>
        <div class="clip-title">
            <img src="./images/Viewer.svg" width="16px"/>
            ${clip.view_count}
        </div>
    `;
}

export default class LinkPreview {

    static async generate(url: string) {
        const urlInstance = new URL(url);

        if(urlInstance.hostname == "youtu.be") {
            // Example:
            // https://youtu.be/YvKT-VXi9V4
            const videoId = urlInstance.pathname.substring(1);
            return "Youtube";
        }
        if(urlInstance.hostname == "www.youtube.com") {
            // Example:
            // https://www.youtube.com/watch?v=CceGHKfOPWw
            const params = Webbrowser.parseSearch(urlInstance.search);
            const videoId = params.v;
            return "Youtube";
        }

        if(urlInstance.hostname == "www.twitch.tv") {
            // Example:
            // https://www.twitch.tv/alinity/clip/SucculentTiredJellyfishHotPokket-tdSy7OSDVfCbU0uS
            const split = urlInstance.pathname.split("/");
            const clipId = split[split.length-1];
            return renderTwitchClip(clipId);
        }
        if(urlInstance.hostname == "clips.twitch.tv") {
            // Example:
            // https://clips.twitch.tv/RefinedSecretiveQueleaDendiFace-VgESj7I4MoK7UNOm
            const clipId = urlInstance.pathname.substring(1);
            return renderTwitchClip(clipId);
        }
    }

}
