import IRC from './services/IRC';

let applicationState = {
    selectedRoom: localStorage.getItem('selected') || "@",
    chatRooms: [],
    chatDetails: {}
}

class AddedRoomEvent extends Event {

    room_name: string;

    constructor(room_name: string) {
        super("addedroom");
        this.room_name = room_name;
    }
}

class CloseRoomEvent extends Event {

    room_name: string;

    constructor(room_name: string) {
        super("closeroom");
        this.room_name = room_name;
    }
}

let chatRooms = {};

export class Application {
    // TODO: get rid of this class

    static setChats(chatMap: object) {
        chatRooms = chatMap;
    }

    static getChats(key: string) {
        if(key) {
            return chatRooms[key];
        }
        return chatRooms;
    }

    static getChannelId(channel_login: string) {
        return applicationState.chatDetails[channel_login].id;
    }

    static saveState() {
        localStorage.setItem('save-state', JSON.stringify(applicationState));
    }

    static setChannelDetails(channel_name: string, info: any) {
        applicationState.chatDetails[channel_name] = info;
        this.saveState();
    }
    
    static async init() {
        const state = localStorage.getItem('save-state');
        if(state) {
            const json = JSON.parse(state);
            applicationState = Object.assign(applicationState, json);
        }

        window.dispatchEvent(new Event('stateloaded'));
    }

    static getSelectedRoom() {
        return applicationState.selectedRoom;
    }

    static getRooms() {
        return applicationState.chatRooms;
    }

    static selectRoom(room_name: string) {
        const prev_chat = Application.getChats(Application.getSelectedRoom());
        if(prev_chat) {
            prev_chat.placeBookmarkLine();
        }

        applicationState.selectedRoom = room_name;
        window.dispatchEvent(new Event('selectroom'));
        localStorage.setItem('selected', room_name);
        this.saveState();

        // const active_chat = Application.getChats(room_name);
        // active_chat.removeBookmarkLine();
    }

    static moveRoom(room: string, newIndex: number) {
        const rooms = applicationState.chatRooms;

        const currIndex = rooms.indexOf(room);
        rooms.splice(currIndex, 1);
        const part1 = rooms.slice(0, newIndex);
        const part2 = rooms.slice(newIndex);

        applicationState.chatRooms = [...part1, room,...part2];
        this.saveState();
    }

    static async addRoom(username: string) {
        applicationState.chatRooms.push(username);
        window.dispatchEvent(new AddedRoomEvent(username));
        this.saveState();
    }

    static closeRoom(username: string) {
        const index = applicationState.chatRooms.indexOf(username);
        applicationState.chatRooms.splice(index, 1);
        window.dispatchEvent(new CloseRoomEvent(username));
        this.selectRoom(this.getRooms()[Math.min(Math.max(0, index), applicationState.chatRooms.length - 1)]);
        this.saveState();
    }

    static openThread(channel: string, message_id: string) {
        const msg = document.querySelector(`[messageid="${message_id}"]`);
        if(msg) {
            const message = msg.message;

            const chat2 = document.createElement('sample-chat');
            chat2.appendMessage(message);

            chat2.style.position = "fixed";
            chat2.style.top = "auto";
            chat2.style.bottom = "100px";
            chat2.style.left = "40px";
            chat2.style.width = "100%";
            chat2.style.height = "100px";
            chat2.style.background = "#333";
            
            document.body.append(chat2);
        }
    }

    static getMessageById(channel:string, message_id: string) {
        const chat = this.getChats(channel);
        const msg = chat.querySelector(`[messageid="${message_id}"]`);
        return msg ? msg.message : undefined;
    }

    static reply(channel: string, message: ChatMessage) {
        Application.selectRoom(channel);
        const input = document.querySelector('chat-input');
        input.insert(message.user_name + ', ');
        input.focus();
        // message.id
        // also place the message id as parent message into the sumbited message
    }

    static timeout(channel: string, user_name: string, secs: number) {
        IRC.sendMessage(channel, `/timeout ${user_name} ${secs}`);
    }

    static unban(channel: string, user_name: string) {
        IRC.sendMessage(channel, `/unban ${user_name}`);
    }

    static openUserCard(channel: string, user_name: string) {
        const url = `https://www.twitch.tv/popout/${channel}/viewercard/${user_name}`;
        open(url);
    }

}