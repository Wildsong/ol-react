import React from 'react';
import PropTypes from 'prop-types';
import {DragZoom as olDragZoom} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragZoom extends OLInteraction {
    static olEvents = ["boxdrag", "boxend", "boxstart"]
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	boxdrag: PropTypes.func,
	boxend: PropTypes.func,
	boxstart: PropTypes.func,
	condition: PropTypes.func,
	duration: PropTypes.number,
	out: PropTypes.bool
    })

    createInteraction(props) {
	return new olDragZoom({
	    condition: props.condition,
	    duration: props.duration,
	    out: props.out
	})
    }
}

