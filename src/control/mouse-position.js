import React from 'react';
import PropTypes from 'prop-types';
import {MousePosition} from 'ol/control';
import {Projection} from 'ol/proj';
import OLComponent from '../ol-component';

// FIXME
// I'd like to have "target" here but think the right way
// is to not use the mouseposition control
// there should be a React component that renders instead
// so I need to catch the mouse event instead of using
// this OL control
// Hence this control just throws the coord onto the map for now

class OLMousePosition extends OLComponent {
    static propTypes = {
    	className: PropTypes.string,
    	coordinateFormat: PropTypes.func, // f(x) that takes coord and returns string
    	projection: PropTypes.oneOfType([
    	    PropTypes.instanceOf(Projection),
    	    PropTypes.string
    	]),
    	undefinedHTML: PropTypes.string, // Show this when mouse outside viewport
        // See also ol-control for more!
    };

    constructor(props) {
        super(props);
    	return new MousePosition({
    	    className: props.className,
    	    coordinateFormat: props.coordinateFormat,
    	    projection: props.projection,
    	    undefinedHTML: props.undefinedHTML,
    	})
    }
}

export default OLMousePosition;
