import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import LineString from 'ol/geom/LineString';

import OLComponent from '../ol-component';

export default class ReactLineString extends OLComponent {
  constructor(props) {
    super(props);
    this.geometry = new LineString();
    this.updateFromProps(props);
  }

  updateFromProps(props) {
    this.geometry.setCoordinates(props.children);
  }

  componentDidMount() {
    this.context.feature.setGeometry(this.geometry);
  }

  componentWillReceiveProps(newProps) {
    this.updateFromProps(newProps);
  }
}

LineString.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number)
  ).isRequired,
}

LineString.contextTypes = {
  feature: PropTypes.instanceOf(Feature)
}
