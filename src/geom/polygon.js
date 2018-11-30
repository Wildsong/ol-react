import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import Polygon from 'ol/geom/Polygon';

import OLComponent from '../ol-component';

export default class ReactPolygon extends OLComponent {
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

Polygon.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number)
  ).isRequired,
}

Polygon.contextTypes = {
  feature: PropTypes.instanceOf(Feature)
}
