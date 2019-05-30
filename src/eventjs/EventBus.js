import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import noop from 'lodash/noop';


export class EventBus {
    _listenersMap = {};

    constructor(props) {
        console.log('Event bus initiated');
        window.EBus = this;
    }

    /*
    * Subscribe on event
    * */
    subscribe(eventName, callback, listenerName) {
        const listeners = this._getListenersForEvent(eventName);
        const listener = new Listener(eventName, callback, listenerName);

        if (isEmpty(listeners)) {
            this._listenersMap[eventName] = [listener];
        } else {
            this._listenersMap[eventName] = filter(this._listenersMap[eventName], l => {
                return !(l.name === listener.name && l.listener === listener.listener);
            });
            this._listenersMap[eventName].push(listener);
        }
    }

    /*
    * Unsubscribe from event
    * */
    unsubscribe(eventName, listenerName) {
        const listeners = this._getListenersForEvent(eventName);
        const listener = new Listener(eventName, noop, listenerName);

        if (!isEmpty(listeners)) {
            this._listenersMap[eventName] = filter(listeners, x => !x.isEqual(listener));
        }
    }

    /*
    * Emit event
    * */
    emit(event) {
        const listeners = this._getListenersForEvent(event.name);

        if (!isEmpty(listeners)) {
            console.log(`Event emit: ${event.name} by ${event.emitter}`);
            for (const l of listeners) {
                l.call(event);
            }
        } else {
            console.log(`Event emit: ${event.name} !No listeners`);
        }
    }

    /*
    * Clear listeners for event
    * */
    clearListenersFor(eventName) {
        //TODO: add wildcard support
        delete this._listenersMap[eventName];
    }

    /*
    * Used to match event name and wildcard subscriptions
    * */
    _getListenersForEvent(eventName) {
        const eventNameTr = eventName.replace('.', '');
        let listeners = [];
        for (const key in this._listenersMap) {
            if (this._listenersMap.hasOwnProperty(key)) {
                const listenerNameRegex = new RegExp(key.replace('.', '').replace('*', '.*'), 'ig');
                if (listenerNameRegex.test(eventNameTr)) {
                    listeners = [...listeners, ...this._listenersMap[key]];
                }
            }
        }
        return listeners;
    }
}

class Listener {
    constructor(name, callback, listener) {
        //TODO: add props validation
        this.name = name;
        this.callback = callback;
        this.listener = listener;
    }

    isEqual(other) {
        return this.name === other.name && this.listener === other.listener;
    }

    call(event) {
        this.callback(event);
    }
}

export class EEvent {
    constructor(name, data = null, emitter = '') {
        this.name = name;
        this.data = data;
        this.emitter = emitter;
    }
}