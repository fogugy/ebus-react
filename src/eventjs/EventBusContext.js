import React, {Component} from 'react';
import {EventBus} from "./EventBus";

export const EventBusContext = React.createContext();

export class EventBusContextProvider extends Component {
    render() {
        const {children} = this.props;
        return (
            <EventBusContext.Provider value={new EventBus()}>
                {children}
            </EventBusContext.Provider>
        );
    }
}
