import React from 'react';
import PropTypes from 'prop-types';
import {Rotate} from 'ol/control';
import OLComponent from '../ol-component';

class OLRotate extends OLComponent {
    static propTypes = {
    	autoHide: PropTypes.bool,
    	className: PropTypes.string,
    	duration: PropTypes.number,
    	label: PropTypes.node,
    	resetNorth: PropTypes.func,
    	tipLabel: PropTypes.string
    }

    constructor(props) {
        super(props);
    	return new Rotate({
    	    autoHide: props.autoHide,
    	    className: props.className,
    	    duration: props.duration,
    	    label: props.label,
    	    resetNorth: props.resetNorth,
    	    tipLabel: props.tipLabel
    	})
    }
}

export default OLRotate;
