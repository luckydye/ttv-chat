//
import "./components/Chat";
import "./components/ChatInput";
import "./components/ChatRooms";
import "./components/Login";
import "./components/Profile";
import "./components/TwitchChat";
import "./components/ProfileIndicator";
import "./components/Tooltip";
import "./components/AsyncImage";
//
import Events from "./events/Events";

import Application from "./app/App";
import Account from "./app/Account";

import Badges from "./services/Badges";
import Emotes from "./services/Emotes";
import Notifications from "./util/Notifications";

import { TwitchChat } from "twitch";

TwitchChat;

async function onLogin(account: Account) {
	console.log("Logged in", account);

	// load critical resources
	await Badges.getGlobalBadges();
	await Emotes.getGlobalEmotes();

	// init state
	await Application.init();

	Application.setAccount(account);

	console.log("Initialized");

	window.dispatchEvent(new Event(Events.Initialize));

	Application.on(Events.ChannelSelected, (e) => {
		const channel = e.data.channel;
		renderSelecetdChat(channel);
	});

	renderSelecetdChat(Application.getSelectedChannel());

	Notifications.initialize();
}

// TODO: find a better method to switch between views = use vue
function renderSelecetdChat(channel: string) {
	const input = document.querySelector("chat-input");
	const container = document.querySelector(".chat");
	if (container) {
		for (let child of container.children) {
			if (child.hide != undefined) {
				child.hide();
			}
		}

		const chat = Application.getChannel(channel);
		const chatEle = chat?.chat;

		if (chatEle) {
			if (!chatEle.parentNode) {
				container.append(chatEle);
			}
			if (channel === "@") {
				input?.setAttribute("disabled", "");
			} else {
				input?.removeAttribute("disabled");
			}

			chatEle.show();
		}
	}
}

window.addEventListener("app-login", (e: LoginEvent) => {
	onLogin(e.data.account);
});

window.addEventListener(Events.ChatCommandEvent, (e) => {
	if (e.data.message == "/poll") {
		alert("create poll dialog");
		e.cancel();
	}
});

window.invoke = async () => {};
window.listen = async () => {};

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register(new URL("./service.ts", import.meta.url), { type: "module" })
		.then(() => {
			console.log("Service worker registered!");
		})
		.catch((err) => {
			console.log("Service worker registration failed: ", err);
		});
}
