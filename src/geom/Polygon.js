import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Polygon from 'ol/geom/Polygon';
import OLGeometry from './OLGeometry';

class OLPolygon extends OLGeometry {
    constructor(props) {
        super(props);
        this.geometry = new Polygon(props.children);
        console.log('polygon props=', props);
    }

    componentWillUnmount() {
        this.context.feature.setGeometry(undefined);
    }
}

// A polygon is an array of linear rings,
// (remember, it's an array of array of arrays so put in extra []...)
//  an optional layout,
//  and optional ends
//
// A linear ring is a set of points and optional layout

// Simple example:
// <Circle> { [ [[0,0], [1,1], [1,0], [0,0]] ] </Circle>}

OLPolygon.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.number)
        )
    ).isRequired,
    editable: PropTypes.bool,
    modifyEnd: PropTypes.func
}

OLPolygon.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLPolygon
