import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import Point from 'ol/geom/Point';

import OLGeometry from './OLGeometry';

class ReactPoint extends OLGeometry {
    constructor(props) {
        super(props);
        console.log('debug point', props.children);
        this.geometry = new Point(props);
        this.updateFromProps(props);
    }

    updateFromProps(props) {
        console.log('debug point update', props.children);
        this.geometry.setCoordinates(props.children);
    }

    componentDidMount() {
        this.context.feature.setGeometry(this.geometry);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }
}

ReactPoint.propTypes = {
    children: PropTypes.arrayOf(PropTypes.number).isRequired,
}

ReactPoint.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default ReactPoint;
