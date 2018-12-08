import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Circle from 'ol/geom/Circle';
import OLGeometry from './OLGeometry';

class OLCircle extends OLGeometry {
    constructor(props) {
        super(props);
        console.log('debug circle props=', props.transform);

        let center = props.children[0];
        if (typeof center === 'number') {
            // center only
            center = props.children;
            this.geometry = new Circle(center);
        } else {
            let radius = props.children[1];
            this.geometry = new Circle(center, radius);
        }
    }
}

// Circle requires a center x,y point
//   optionally radius (default 0)
//   and layout (default XY, I hope!)  UNSUPPORTED
//
//  <Circle>{[[x,y], radius]}</Circle>
//  <Circle>{[x,y]}</Circle>

OLCircle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.node // [[x,y],radius]
    ]).isRequired,
}

//OLCircle.defaultProps = {
//
//}

OLCircle.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLCircle;
