import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import OLGeometry from './ol-geometry';

/*
 * Allows combining a ol.geom.Geometry class with ol- Useful if you have
 * retrieved the object from somewhere else, and don't want to convert back
 * into an ol-react component.
 */

export default class RawGeometry extends OLGeometry {
    static propTypes = {
	geometry: PropTypes.instanceOf(Geometry).isRequired
    }

    componentDidMount() {
	this.context.feature.setGeometry(this.props.geometry);
    }

    componentWillUnmount() {
	this.context.feature.setGeometry(undefined);
    }
}

