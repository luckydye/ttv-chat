
let applicationState = {
    selectedRoom: localStorage.getItem('selected') || "luckydye",
    chatRooms: [
        "luckydye",
        "richwcampbell",
        "nmplol",
        "mizkif",
        "nidalida",
        "cyr",
        "maya",
        "cihanonstage",
        "nymn",
        "emiru",
        "ludwig",
        "esfandtv",
    ],
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

export class Application {

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

}