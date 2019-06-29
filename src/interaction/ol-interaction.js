import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import { unByKey } from 'ol/Observable';
import OLComponent from '../ol-component'

export default class OLInteraction extends OLComponent {
    static contextType = MapContext;
    static propTypes = {
	    active: PropTypes.bool
    }
    static defaultProps = {
	    active: true
    }

    // In derived classes, override this list of events
    // with the events that this interaction responds to,
    // and a handler of the same name as a property.
    //static olEvents = [];

    componentDidMount() {
        console.log("interaction.componentDidMount", this.props);
        this.interaction = this.createInteraction()
        this.eventHandlerKeys_ = {}

        this.updateActiveState_(this.props)
        this.updateEventHandlersFromProps_(this.props)
        this.context.map.addInteraction(this.interaction)
    }

    componentDidUpdate(prevProps) {

        // This is used in Draw interaction when changing type eg Point to LineString.
        if (this.props.hasOwnProperty("type") && (this.props.type != prevProps.type)) {
            console.log("interaction.componentDidUpdate changed ", prevProps.type, " =>", this.props.type);
            this.context.map.removeInteraction(this.interaction)
            this.interaction = this.createInteraction()

            this.updateActiveState_(this.props)
            this.updateEventHandlersFromProps_(this.props, prevProps)
            this.context.map.addInteraction(this.interaction)
        }
    }

    componentWillUnmount() {
        console.log("interaction.componentWillUnmount");
        this.context.map.removeInteraction(this.interaction)
        this.updateEventHandlersFromProps_({})
    }

    createInteraction(props) {
        throw new TypeError(
            'You must override createInteraction() in classes derived from OLInteraction'
        )
    }

    updateActiveState_(props) {
        if (props.hasOwnProperty("active")) {
            this.interaction.setActive(props.active)
        } else {
            this.interaction.setActive(true)
        }
    }

    updateEventHandler_(name, handler) {
        const key = this.eventHandlerKeys_[name]
        if (key) {
            //console.log("Deleting handler", name, handler);
            unByKey(key);
            delete this.eventHandlerKeys_[name]
        }
        if (handler) {
            //console.log("Adding handler", name, handler);
            this.eventHandlerKeys_[name] = this.interaction.on(name, handler)
        }
    }

    updateEventHandlersFromProps_(props, oldProps) {
        const events = this.constructor.olEvents || []
        for (let prop of events) {
            const handler = props[prop]
            const oldHandler = oldProps ? oldProps[prop] : undefined
            if (oldHandler !== handler) {
                this.updateEventHandler_(prop, handler)
            }
        }
    }
}
