import React from 'react';
import PropTypes from 'prop-types';
import {Attribution} from 'ol/control';
import OLControl from './ol-control';

class OLAttribution extends OLControl {
  createControl (props) {
      console.log("control.Attribution props=", props)
    return new Attribution({
      className: props.className,
      collapsed: props.collapsed,
      collapseLabel: props.collapseLabel,
      collapsible: props.collapsible,
      label: props.label,
      tipLabel: props.tipLabel
    })
  }
}

OLAttribution.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  collapseLabel: PropTypes.string,
  collapsible: PropTypes.bool,
  label: PropTypes.node,
  tipLabel: PropTypes.string
})

export default OLAttribution
