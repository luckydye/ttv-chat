import { css, html, LitElement } from 'lit-element';
import { getUserInfo } from '../services/Twitch';

export default class ProfileIndicator extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .profile-icon {
                position: relative;
            }
            .profile-icon[live]::after {
                content: "";
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                overflow: hidden;
                background: #d40b0b;
            }
            .profile-icon .image {
                overflow: hidden;
                border-radius: 50%;
                background: #333333;
                box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.25);
            }
            .profile-icon img {
                width: 25px;
                height: 25px;
                display: block;
            }
            .profile-icon img[loading] {
                opacity: 0;
            }
        `;
    }

    live = false;
    username = "";

    constructor(user_login: string) {
        super();

        this.username = user_login;

        const img = new Image();
        img.width = 24;
        img.alt = user_login;
        img.setAttribute('loading', '');

        this.profileImage = img;

        const update_info = () => getUserInfo(user_login).then(info => {
            this.live = info.stream?.type == "live" ? true : false;

            img.src = info.profile_image_url;
            img.removeAttribute('loading');

            this.update();

            setTimeout(() => update_info(), 1000 * 30);
        });
        update_info();
    }

    render() {
        return html`
            <div class="profile-icon" ?live="${this.live}">
                <div class="image">
                    ${this.profileImage}
                </div>
            </div>
        `;
    }
}

customElements.define('profile-indicator', ProfileIndicator);