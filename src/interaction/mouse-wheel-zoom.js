import React from 'react';
import PropTypes from 'prop-types';
import ol from 'ol';
import OLInteraction from './ol-interaction';

export default class MouseWheelZoom extends OLInteraction {
  createInteraction (props) {
    return new ol.interaction.MouseWheelZoom({
      duration: props.duration,
      useAnchor: props.useAnchor
    })
  }
}

MouseWheelZoom.propTypes = Object.assign({}, OLInteraction.propTypes, {
  duration: PropTypes.number,
  useAnchor: PropTypes.bool
})
