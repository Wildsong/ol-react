import React from 'react';
import PropTypes from 'prop-types';
import {Draw as olDraw} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class Draw extends OLInteraction {
    createInteraction (props) {
        return new olDraw({
            type: props.type
        })
    }
}

Draw.propTypes = Object.assign({}, OLInteraction.propTypes, {
    drawend: PropTypes.func,
    drawstart: PropTypes.func,
    type: PropTypes.string.isRequired,
    maxPoints: PropTypes.number,
    minPoints: PropTypes.number
})

Draw.olEvents = ["drawend", "drawstart"]
