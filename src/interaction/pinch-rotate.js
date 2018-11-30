import React from 'react';
import PropTypes from 'prop-types';

import {PinchRotate as olPinchRotate} from 'ol/interaction';

import OLInteraction from './ol-interaction';

export default class PinchRotate extends OLInteraction {
  createInteraction (props) {
    return new olPinchRotate({
      threshold: props.threshold,
      duration: props.duration
    })
  }
}

PinchRotate.propTypes = Object.assign({}, OLInteraction.propTypes, {
  threshold: PropTypes.number,
  duration: PropTypes.number
})
