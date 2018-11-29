import React from 'react';
import PropTypes from 'prop-types';
import ol from 'ol';
import OLControl from './ol-control';

export default class FullScreen extends OLControl {
  createControl (props) {
    return new ol.control.FullScreen({
      className: props.className,
      keys: props.keys,
      label: props.label,
      labelActive: props.labelActive,
      source: props.source,
      tipLabel: props.tipLabel
    })
  }
}

FullScreen.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  keys: PropTypes.bool,
  label: PropTypes.node,
  labelActive: PropTypes.node,
  source: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.any
  ]),
  tipLabel: PropTypes.string
})
