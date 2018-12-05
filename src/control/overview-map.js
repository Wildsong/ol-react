import React from 'react';
import PropTypes from 'prop-types';
import {View, Collection} from 'ol';
import {Layer} from 'ol/layer';
import OLControl from './ol-control';

class OverviewMap extends OLControl {
  createControl (props) {
    return new ol.control.OverviewMap({
      className: props.className,
      collapsed: props.collapsed,
      collapseLabel: props.collapseLabel,
      collapsible: props.collapsible,
      label: props.label,
      layers: props.layers,
      tipLabel: props.tipLabel,
      view: props.view
    })
  }
}

OverviewMap.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  collapseLabel: PropTypes.string,
  collapsible: PropTypes.bool,
  label: PropTypes.node,
  layers: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    PropTypes.instanceOf(Collection)
  ]),
  tipLabel: PropTypes.string,
  view: PropTypes.instanceOf(View)
})

export default OverviewMap
