import React from 'react';
import PropTypes from 'prop-types';
import {DragRotate as olDragRotate} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragRotate extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	condition: PropTypes.func,
	duration: PropTypes.number
    })

    createInteraction(props) {
	return new olDragRotate({
	    condition: props.condition,
	    duration: props.duration
	})
    }
}

