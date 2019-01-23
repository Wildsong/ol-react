import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import OLComponent from '../ol-component'

export default class OLInteraction extends OLComponent {
    static contextType = MapContext;
    static propTypes = {
	active: PropTypes.bool
    }
    static defaultProps = {
	active: true
    }

    componentDidMount() {
	//        console.log("OLInteractive.componentDidMount()")
        this.interaction = this.createInteraction(this.props)
        this.eventHandlerKeys_ = {}

        this.updateActiveState_(this.props)
        this.updateEventHandlersFromProps_(this.props)
        this.context.map.addInteraction(this.interaction)
    }

    // FIXME this happens a little more often than I'd like
    // which means we should see if anything has changed before
    // running the code here,  so we don't render without need
    componentDidUpdate(prevProps) {
	//        console.log("OLInteractive.componentDidUpdate()", this.interaction)

        this.context.map.removeInteraction(this.interaction)

        this.interaction = this.createInteraction(this.props)
        this.updateActiveState_(this.props)
        this.updateEventHandlersFromProps_(this.props, prevProps)
        this.context.map.addInteraction(this.interaction)
    }

    componentWillUnmount() {
        console.log("OLInteractive.componentDidMount()")
        this.context.map.removeInteraction(this.interaction)
        this.updateEventHandlersFromProps_({})
    }

    createInteraction(props) {
        throw new TypeError('You must override createInteraction() in classes derived ' +
                            'from OLInteraction')
    }

    updateActiveState_(props) {
        if (props.hasOwnProperty("active")) {
            this.interaction.setActive(props.active)
        } else {
            this.interaction.setActive(true)
        }
    }

    // FIXME:
    // I think OL5 does not use the ".on" method, it uses normal JavaScript events.
    // so I need to visit ALL of this code and see what is going on here
    // See draw and drag-and-drop for examples of the current convention

    updateEventHandler_(name, handler) {
        const key = this.eventHandlerKeys_[name]
        if (key) {
            this.interaction.unByKey(key)
            delete this.eventHandlerKeys_[name]
        }
        if (handler) {
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



