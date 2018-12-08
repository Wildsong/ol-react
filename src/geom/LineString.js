import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import LineString from 'ol/geom/LineString';
import GeometryLayout from 'ol/geom/GeometryLayout';
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

OLLineString.propTypes = {
    children: PropTypes.arrayOf(
                  PropTypes.arrayOf(PropTypes.number)
              ).isRequired
//    layout: PropTypes.instanceOf(GeometryLayout) maybe goes in OLGeometry?
}

OLLineString.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLLineString
