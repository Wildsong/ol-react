import React from 'react';
import PropTypes from 'prop-types';
import {MousePosition} from 'ol/control';
import {Projection} from 'ol/proj';
import OLControl from './ol-control';

export default class OLMousePosition extends OLControl {
  createControl (props) {
    return new MousePosition({
      className: props.className,
      coordinateFormat: props.coordinateFormat,
      projection: props.projection,
      undefinedHTML: props.undefinedHTML
    })
  }
}

OLMousePosition.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  coordinateFormat: PropTypes.func,
  projection: PropTypes.oneOfType([
    PropTypes.instanceOf(Projection),
    PropTypes.string
  ]),
  undefinedHTML: PropTypes.string
})
