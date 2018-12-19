/**
 * @file Property type validators for OpenLayers custom typedefs.
 */
import React from 'react';
import {PropTypes} from 'prop-types'

let OLPropTypes = {}

/*
 * Custom validator function for ol.Extent (an array of four numbers).
 */
OLPropTypes.Extent = function(props, propName, componentName) {
  if (
      // This cannot be a function call anymore. It throws a warning
    PropTypes.arrayOf(PropTypes.number)(props, propName, componentName) instanceof Error ||
    props[propName].length !== 4
  ) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`. Validation failed.'
    );
  }
}

export default OLPropTypes
