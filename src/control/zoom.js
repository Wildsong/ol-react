import React from 'react';
import PropTypes from 'prop-types';
import {Zoom} from 'ol/control';
import OLControl from './ol-control';

class OLZoom extends OLControl {
  createControl (props) {
    return new Zoom({
      className: props.className,
      delta: props.delta,
      duration: props.duration,
      zoomInLabel: props.zoomInLabel,
      zoomInTipLabel: props.zoomInTipLabel,
      zoomOutLabel: props.zoomOutLabel,
      zoomOutTipLabel: props.zoomOutTipLabel
    })
  }
}

Zoom.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  delta: PropTypes.number,
  duration: PropTypes.number,
  zoomInLabel: PropTypes.node,
  zoomInTipLabel: PropTypes.string,
  zoomOutLabel: PropTypes.node,
  zoomOutTipLabel: PropTypes.string
})

export default Zoom
