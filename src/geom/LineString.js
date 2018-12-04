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
        // I think this is redundant, happens in "new LineString()"
    //  this.geometry.setCoordinates(props.children);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }

    componentWillUnmount() {
        this.context.feature.setGeometry(undefined);
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
