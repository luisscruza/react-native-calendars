import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import CalendarContext from './index';
function asCalendarConsumer(WrappedComponent) {
    class CalendarConsumer extends Component {
        constructor() {
            super(...arguments);
            this.saveRef = (r) => {
                this.contentRef = r;
            };
        }
        render() {
            return (React.createElement(CalendarContext.Consumer, null, context => React.createElement(WrappedComponent, Object.assign({ ref: this.saveRef, context: context }, this.props))));
        }
    }
    hoistNonReactStatic(CalendarConsumer, WrappedComponent);
    return CalendarConsumer;
}
export default asCalendarConsumer;
