import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import Polygon from 'ol/geom/Polygon';

import OLGeometry from './OLGeometry';

class ReactPolygon extends OLGeometry {
    constructor(props) {
        super(props);
        this.geometry = new Polygon();
        this.updateFromProps(props);
    }

    updateFromProps(props) {
        this.geometry.setCoordinates([this.props.children]);
    }

    componentDidMount() {
        this.context.feature.setGeometry(this.geometry);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }

    render() {
        return false;
    }
}

// A polygon is an array of linear rings,
//  an optional layout,
// and optional ends
//
// A linear ring is a set of points and optional layout

ReactPolygon.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired,
}

ReactPolygon.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default ReactPolygon;
