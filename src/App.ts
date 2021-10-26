
const applicationState = {
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
    
    static async init() {
        // load resources etc
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
    }

}