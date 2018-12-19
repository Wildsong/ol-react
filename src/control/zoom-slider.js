import React from 'react';
import PropTypes from 'prop-types';
import {ZoomSlider} from 'ol/control';
import OLControl from './ol-control';

export default class OLZoomSlider extends OLControl {
  createControl (props) {
    return new ZoomSlider({
      className: props.className,
      duration: props.duration,
      maxResolution: props.maxResolution,
      minResolution: props.duration
    })
  }
}

OLZoomSlider.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  duration: PropTypes.number,
  maxResolution: PropTypes.number,
  minResolution: PropTypes.number
})
