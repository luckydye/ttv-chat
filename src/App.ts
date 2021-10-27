
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
        window.dispatchEvent(new Event('addedroom'));
        this.saveState();
    }

}