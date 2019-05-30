import {EEvent} from "./index";


class EController {
    constructor({ebus}) {
        this._ebus = ebus;
        this._subscribe();
    }

    get eventListeners() {
        return {};
    }

    _subscribe() {
        for (const ename in this.eventListeners) {
            this._ebus.subscribe(ename, this.eventListeners[ename], this.constructor.name);
        }
    }

    unsubscribe() {
        for (const ename in this.eventListeners) {
            this._ebus.unsubscribe(ename, this.constructor.name);
        }
    }

    emit(eventName, data = null) {
        const event = new EEvent(eventName, data, this.constructor.name);
        this._ebus.emit(event);
    }
}

export {EController}