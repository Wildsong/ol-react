import React from 'react';
import PropTypes from 'prop-types';
import {PinchZoom as olPinchZoom} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class PinchZoom extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	duration: PropTypes.number
    })

    createInteraction (props) {
	return new olPinchZoom({
	    duration: props.duration
	})
    }
}

