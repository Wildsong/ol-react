import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import LineString from 'ol/geom/LineString';
import GeometryLayout from 'ol/geom/GeometryLayout';

import OLGeometry from './OLGeometry';

class ReactLineString extends OLGeometry {
    constructor(props) {
        super(props);
        console.log('debug line:', props.children);
        console.log('debug line layout:', props.layout);

        this.geometry = new LineString(props.children, props.layout);
        this.updateFromProps(props);
    }

    updateFromProps(props) {
    //  this.geometry.setCoordinates(props.children);
    }

    componentWillReceiveProps(newProps) {
        // I should probably be worried about what this does
        this.updateFromProps(newProps);
    }

    render() {
        return false;
    }
}

ReactLineString.propTypes = {
    children: PropTypes.arrayOf(
                  PropTypes.arrayOf(PropTypes.number)
              ).isRequired,
//    layout: PropTypes.instanceOf(GeometryLayout)
}

ReactLineString.contextTypes = {
  feature: PropTypes.instanceOf(Feature)
}

export default ReactLineString
