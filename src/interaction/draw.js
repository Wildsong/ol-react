import React from 'react';
import PropTypes from 'prop-types';
import ol from 'ol';
import OLInteraction from './ol-interaction';

export default class Draw extends OLInteraction {
  createInteraction (props) {
    return new ol.interaction.Draw({
      type: props.type
    })
  }
}

Draw.propTypes = Object.assign({}, OLInteraction.propTypes, {
  drawend: PropTypes.func,
  drawstart: PropTypes.func,
  type: PropTypes.string.isRequired
})

Draw.olEvents = ["drawend", "drawstart"]
