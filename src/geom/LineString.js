import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import LineString from 'ol/geom/LineString';
import OLGeometry from './OLGeometry';

class OLLineString extends OLGeometry {
    constructor(props) {
        super(props);
        this.geometry = new LineString(props.children, props.layout);
        console.log('linestring props=', props);
    }

    componentWillUnmount() {
        this.context.feature.setGeometry(undefined);
    }
}

// A linestring is an array of points and an optional layout.

OLLineString.propTypes = {
    children: PropTypes.arrayOf(
                  PropTypes.arrayOf(PropTypes.number)
              ).isRequired
}

OLLineString.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLLineString
