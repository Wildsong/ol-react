import React from 'react'
import PropTypes from 'prop-types'
import { MouseWheelZoom as olMouseWheelZoom } from 'ol/interaction'
import OLInteraction from './ol-interaction'

export default class MouseWheelZoom extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
    	duration: PropTypes.number,
    	useAnchor: PropTypes.bool
    })

    createInteraction() {
    	return new olMouseWheelZoom({
    	    duration: this.props.duration,
    	    useAnchor: this.props.useAnchor
    	})
    }
}
