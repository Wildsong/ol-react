import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Polygon from 'ol/geom/Polygon';
import OLGeometry from './ol-geometry';

// A polygon is an array of linear rings,
// (remember, it's an array of array of arrays so put in extra []...)
//  an optional layout,
//  and optional ends
//
// A linear ring is a set of points and optional layout

// Simple example:
// <Circle> { [ [[0,0], [1,1], [1,0], [0,0]] ] </Circle>}


export default class OLPolygon extends OLGeometry {
    static propTypes = {
	children: PropTypes.arrayOf(
            PropTypes.arrayOf(
		PropTypes.arrayOf(PropTypes.number)
            )
	).isRequired,
	editable: PropTypes.bool,
	modifyEnd: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state.geometry = new Polygon(this.props.children);
        //console.log('polygon props=', this.props);
    }

    componentWillUnmount() {
        this.context.feature.setGeometry(undefined);
    }
}

