import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Circle from 'ol/geom/Circle';
import OLGeometry from './OLGeometry';

class OLCircle extends OLGeometry {
    constructor(props) {
        super(props);
//        console.log('debug circle center=', props.children[0], "radius=", props.children[1]);
        this.geometry = new Circle(props.children[0], props.children[1]);
    }
}

// Circle requires a center x,y point
//   optionally radius (default 0)
//   and layout (default XY, I hope!)

OLCircle.propTypes = {
//    children: [
//        PropTypes.arrayOf(PropTypes.number).isRequired, // center requirement
//        PropTypes.instanceOf(PropTypes.number)         // radius option
//    ]                                        // layout option
//    }
}

OLCircle.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLCircle;
