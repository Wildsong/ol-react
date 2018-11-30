import React from 'react';
import PropTypes from 'prop-types';

import {MousePosition as olMousePosition} from 'ol/control';
import {Projection} from 'ol/proj';

import OLControl from './ol-control';

export default class MousePosition extends OLControl {
  createControl (props) {
    return new olMousePosition({
      className: props.className,
      coordinateFormat: props.coordinateFormat,
      projection: props.projection,
      undefinedHTML: props.undefinedHTML
    })
  }
}

MousePosition.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  coordinateFormat: PropTypes.func,
  projection: PropTypes.oneOfType([
    PropTypes.instanceOf(Projection),
    PropTypes.string
  ]),
  undefinedHTML: PropTypes.string
})
