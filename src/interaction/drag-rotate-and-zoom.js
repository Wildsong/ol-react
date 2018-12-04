import React from 'react';
import PropTypes from 'prop-types';
import {DragRotateAndZoom as olDragRotateAndZoom} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragRotateAndZoom extends OLInteraction {
  createInteraction (props) {
    return new olDragRotateAndZoom({
      condition: props.condition,
      duration: props.duration
    })
  }
}

DragRotateAndZoom.propTypes = Object.assign({}, OLInteraction.propTypes, {
  condition: PropTypes.func,
  duration: PropTypes.number
})
