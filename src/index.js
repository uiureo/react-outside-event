import React from 'react';
import ReactDOM from 'react';

/**
 * @param {ReactClass} Target The component that defines `onOutsideEvent` handler.
 * @param {String[]} supportedEvents A list of valid DOM event names. Default: ['mousedown'].
 * @return {ReactClass}
 */
export default (Target, supportedEvents = ['mousedown']) => {
    return class ReactOutsideEvent extends React.Component {
        componentDidMount = () => {
            if (!this.refs.target.onOutsideEvent) {
                throw new Error('Component does not defined "onOutsideEvent" method.');
            }

            supportedEvents.forEach((eventName) => {
                window.addEventListener(eventName, this.handleEvent, false);
            });
        };

        componentWillUnmount = () => {
            supportedEvents.forEach((eventName) => {
                window.removeEventListener(eventName, this.handleEvent, false);
            });
        };

        handleEvent = (event) => {
            let target,
                targetElement,
                isInside,
                isOutside;

            target = this.refs.target;
            targetElement = ReactDOM.findDOMNode(target);
            isInside = targetElement.contains(event.target) || targetElement === event.target;
            isOutside = !isInside;



            if (isOutside) {
                target.onOutsideEvent(event);
            }
        };

        render() {
            return <Target ref='target' {... this.props} />;
        }
    }
};
