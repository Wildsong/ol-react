import React from 'react';
import PropTypes from 'prop-types';
import {DoubleClickZoom as olDoubleClickZoom} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DoubleClickZoom extends OLInteraction {
  createInteraction (props) {
    return new olDoubleClickZoom({
      delta: props.delta,
      duration: props.duration
    })
  }
}

DoubleClickZoom.propTypes = Object.assign({}, OLInteraction.propTypes, {
  delta: PropTypes.number,
  duration: PropTypes.number
})
