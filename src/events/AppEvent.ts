export default class AppEvent extends Event {
    
    static get type() {
        return "unknown-event";
    }

    data: any;

    constructor(eventType: string) {
        if(!eventType) {
            throw new Error("Tried to create event without type");
        }
        super(eventType);
        this.data = {};
    }

}