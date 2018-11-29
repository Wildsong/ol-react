import React from 'react';
import PropTypes from 'prop-types';
import ol from 'ol';
import OLInteraction from './ol-interaction';

export default class PinchZoom extends OLInteraction {
  createInteraction (props) {
    return new ol.interaction.PinchZoom({
      duration: props.duration
    })
  }
}

PinchZoom.propTypes = Object.assign({}, OLInteraction.propTypes, {
  duration: PropTypes.number
})
