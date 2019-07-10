import React from 'react';
import PropTypes from 'prop-types';
import {ZoomSlider} from 'ol/control';
import OLComponent from '../ol-component';

class OLZoomSlider extends OLComponent {
    static propTypes = {
    	className: PropTypes.string,
    	duration: PropTypes.number,
    	maxResolution: PropTypes.number,
    	minResolution: PropTypes.number
    }

    constructor(props) {
    	return new ZoomSlider({
    	    className: props.className,
    	    duration: props.duration,
    	    maxResolution: props.maxResolution,
    	    minResolution: props.duration
    	})
    }
}
export default OLZoomSlider;
