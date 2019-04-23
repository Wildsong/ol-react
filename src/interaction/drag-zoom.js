import React from 'react'
import PropTypes from 'prop-types'
import { DragZoom as olDragZoom } from 'ol/interaction'
import OLInteraction from './ol-interaction'

export default class DragZoom extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
    	boxdrag: PropTypes.func,
    	boxend: PropTypes.func,
    	boxstart: PropTypes.func,
    	condition: PropTypes.func,
    	duration: PropTypes.number,
    	out: PropTypes.bool
    })

    static olEvents = ["boxdrag", "boxend", "boxstart"]

    createInteraction() {
    	return new olDragZoom({
    	    condition: this.props.condition,
    	    duration: this.props.duration,
    	    out: this.props.out
    	})
    }
}
