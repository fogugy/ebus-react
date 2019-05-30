import {Component} from 'react';
import {EventBusContext} from "./EventBusContext";
import {EEvent} from "./EventBus";


class EComponent extends Component {
    static contextType = EventBusContext;

    componentDidMount() {
        this._ebus = this.context;
        this._ebus.subscribe('bl.init.success', e => this.init(e), this.name);
        this.init();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    get eventListeners() {
        return {};
    }

    get name() {
        return this.constructor.name;
    }

    init() {
        this._subscribe();
    }

    _subscribe() {
        for (const ename in this.eventListeners) {
            this._ebus.subscribe(ename, this.eventListeners[ename], this.name);
        }
    }

    unsubscribe() {
        this._ebus.unsubscribe('bl.init.success', this.name);
        for (const ename in this.eventListeners) {
            this._ebus.unsubscribe(ename, this.name);
        }
    }

    emit(eventName, data = null) {
        const event = new EEvent(eventName, data, this.name);
        this._ebus.emit(event);
    }
}

export {EComponent}