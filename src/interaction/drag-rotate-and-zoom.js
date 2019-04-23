import React from 'react'
import PropTypes from 'prop-types'
import { DragRotateAndZoom as olDragRotateAndZoom } from 'ol/interaction'
import OLInteraction from './ol-interaction'

export default class DragRotateAndZoom extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	    condition: PropTypes.func,
	    duration: PropTypes.number
    })

    createInteraction() {
    	return new olDragRotateAndZoom({
    	    condition: this.props.condition,
    	    duration: this.props.duration
    	})
    }
}
