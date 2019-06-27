import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import LineString from 'ol/geom/LineString';
import OLGeometry from './ol-geometry';

export default class OLLineString extends OLGeometry {
    static propTypes = {
	children: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.number)
        ).isRequired
    }
    constructor(props) {
        super(props);
        this.geometry = new LineString(props.children, props.layout);
    }
}

// A linestring is an array of points and an optional layout.
