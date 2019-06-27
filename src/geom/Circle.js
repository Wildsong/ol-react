import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Circle from 'ol/geom/Circle';
import OLGeometry from './ol-geometry';

export default class OLCircle extends OLGeometry {
    static propTypes = {
	children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),  // [x,y]
            PropTypes.node                        // [[x,y], radius]
	]).isRequired,
    }
    static defaultProps = {
    }

    constructor(props) {
        super(props);

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
