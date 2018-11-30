import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';

import OLComponent from '../ol-component';

export default class RawGeometry extends OLComponent {
  /*
   * Allows combining a ol.geom.Geometry class with ol- Useful if you have
   * retrieved the object from somewhere else, and don't want to convert back
   * into an ol-react component.
   */
  componentDidMount() {
    this.context.feature.setGeometry(this.props.geometry);
  }

  componentWillUnmount() {
    this.context.feature.setGeometry(undefined);
  }
}

RawGeometry.propTypes = {
  geometry: PropTypes.instanceOf(Geometry).isRequired
}

RawGeometry.contextTypes = {
  feature: PropTypes.instanceOf(Feature)
}
