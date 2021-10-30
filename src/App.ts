
let applicationState = {
    selectedRoom: localStorage.getItem('selected') || "@",
    chatRooms: [],
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

    static setChats(chatMap: object) {
        chatRooms = chatMap;
    }

    static getChats(key: string) {
        if(key) {
            return chatRooms[key];
        }
        return chatRooms;
    }

    static saveState() {
        localStorage.setItem('save-state', JSON.stringify(applicationState));
    }
    
    static async init() {
        const state = localStorage.getItem('save-state');
        if(state) {
            applicationState = JSON.parse(state);
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
        applicationState.selectedRoom = room_name;
        window.dispatchEvent(new Event('selectroom'));
        localStorage.setItem('selected', room_name);
        this.saveState();
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

    static addRoom(username: string) {
        applicationState.chatRooms.push(username);
        window.dispatchEvent(new AddedRoomEvent(username));
        this.saveState();
    }

    static closeRoom(username: string) {
        const index = applicationState.chatRooms.indexOf(username);
        applicationState.chatRooms.splice(index, 1);
        window.dispatchEvent(new CloseRoomEvent(username));
        this.selectRoom(this.getRooms()[Math.max(0, index)]);
        this.saveState();
    }

    static reply(message_id: string) {
        alert('reply to ' + message_id);
    }

    static timeout(user_name: string, secs: number) {
        alert('timeout ' + user_name + ' for ' + secs + " seconds");
    }

}