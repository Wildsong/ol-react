import React from 'react';
import PropTypes from 'prop-types';
import {DoubleClickZoom as olDoubleClickZoom} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DoubleClickZoom extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	    delta: PropTypes.number,
	    duration: PropTypes.number
    })

    createInteraction() {
	    return new olDoubleClickZoom({
	        delta: this.props.delta,
	        duration: this.props.duration
	    })
    }
}
