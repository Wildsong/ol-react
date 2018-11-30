import React from 'react';
import PropTypes from 'prop-types';

import {PinchZoom as olPinchZoom} from 'ol/interaction';

import OLInteraction from './ol-interaction';

export default class PinchZoom extends OLInteraction {
  createInteraction (props) {
    return new olPinchZoom({
      duration: props.duration
    })
  }
}

PinchZoom.propTypes = Object.assign({}, OLInteraction.propTypes, {
  duration: PropTypes.number
})
