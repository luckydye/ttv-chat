import Webbrowser from "../util/Webbrowser";
import TwitchApi from "../services/twitch/Api";
import { html } from "lit";
import YouTubeApi from "../services/YouTube";

async function renderYouTubeVideo(videoId: string) {
  const vid = await YouTubeApi.getVideo(videoId);

  const view_count = vid.statistics.viewCount;
  const title = vid.snippet.title;
  const channel = vid.snippet.channelTitle;
  const thumb = vid.snippet.thumbnails.medium.url;

  return html`
    <div class="clip-thumbnail">
      <img src="${thumb}" width="180px" />
    </div>
    <div class="clip-title">${title}</div>
    <div>${channel}</div>
    <div>
      <img src="./images/Viewer.svg" width="16px" />
      ${view_count}
    </div>
  `;
}

async function renderTwitchClip(clipId: string) {
  const clips = await TwitchApi.getClip(clipId);
  const clip = clips[0];

  return html`
    <div class="clip-thumbnail">
      <img src="${clip.thumbnail_url}" width="180px" />
    </div>
    <div class="clip-title">${clip.title}</div>
    <div>
      <img src="./images/Viewer.svg" width="16px" />
      ${clip.view_count}
    </div>
  `;
}

export default class LinkPreview {
  static async generate(url: string) {
    const urlInstance = new URL(url);

    if (urlInstance.hostname == "youtu.be") {
      // Example:
      // https://youtu.be/YvKT-VXi9V4
      const videoId = urlInstance.pathname.substring(1);
      return renderYouTubeVideo(videoId);
    }
    if (urlInstance.hostname == "www.youtube.com") {
      // Example:
      // https://www.youtube.com/watch?v=CceGHKfOPWw
      const params = Webbrowser.parseSearch(urlInstance.search);
      const videoId = params.v;
      return renderYouTubeVideo(videoId);
    }

    if (urlInstance.hostname == "www.twitch.tv") {
      // Example:
      // https://www.twitch.tv/alinity/clip/SucculentTiredJellyfishHotPokket-tdSy7OSDVfCbU0uS
      const split = urlInstance.pathname.split("/");
      const clipId = split[split.length - 1];
      return renderTwitchClip(clipId);
    }
    if (urlInstance.hostname == "clips.twitch.tv") {
      // Example:
      // https://clips.twitch.tv/RefinedSecretiveQueleaDendiFace-VgESj7I4MoK7UNOm
      const clipId = urlInstance.pathname.substring(1);
      return renderTwitchClip(clipId);
    }
  }
}
