import React from 'react';
import PropTypes from 'prop-types';
import {DragBox as olDragBox} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragBox extends OLInteraction {
  createInteraction (props) {
    return new olDragBox({
      condition: props.condition
    })
  }
}

DragBox.propTypes = Object.assign({}, OLInteraction.propTypes, {
  boxdrag: PropTypes.func,
  boxend: PropTypes.func,
  boxstart: PropTypes.func,
  condition: PropTypes.func
})

DragBox.olEvents = ["boxdrag", "boxend", "boxstart"]
