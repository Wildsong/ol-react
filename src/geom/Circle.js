import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Circle from 'ol/geom/Circle';
import OLGeometry from './OLGeometry';

class OLCircle extends OLGeometry {
    constructor(props) {
        super(props);
        console.log('debug circle props=', props);

        // props can be "center" or "center, radius"
        let center = props.children[0];
        console.log(typeof center)
        if (typeof center === 'number') {
            center = props.children;
            console.log("coords=", center);
            this.geometry = new Circle(center);
        } else {
            let radius = props.children[1];
            console.log("coords=", center, " radius=", radius);
            this.geometry = new Circle(center, radius);
        }
    }
}

// Circle requires a center x,y point
//   optionally radius (default 0)
//   and layout (default XY, I hope!)

OLCircle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.node // [[x,y],radius]
    ]).isRequired
// layout option
}

//OLCircle.defaultProps = {
//
//}

OLCircle.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLCircle;
