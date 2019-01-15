import React from 'react';
import PropTypes from 'prop-types';
import {MousePosition} from 'ol/control';
import {Projection} from 'ol/proj';
import OLControl from './ol-control';

// FIXME
// I'd like to have "target" here but think the right way
// is to not use the mouseposition control
// there should be a React component that renders instead
// so I need to catch the mouse event instead of using
// this OL control
// Hence this control just throws the coord onto the map for now

export default class OLMousePosition extends OLControl {
  createControl (props) {
    return new MousePosition({
      className: props.className,
      coordinateFormat: props.coordinateFormat,
      projection: props.projection,
      undefinedHTML: props.undefinedHTML,
    })
  }
}

OLMousePosition.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  coordinateFormat: PropTypes.func, // f that takes coord and returns string
  projection: PropTypes.oneOfType([
    PropTypes.instanceOf(Projection),
    PropTypes.string
  ]),
  undefinedHTML: PropTypes.string,
})
