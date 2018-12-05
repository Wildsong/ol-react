import React from 'react';
import PropTypes from 'prop-types';
import {Draw} from 'ol/interaction';
import OLInteraction from './ol-interaction';

class ReactDraw extends OLInteraction {
    createInteraction (props) {
        return new Draw({
            type: props.type,
            maxPoints: props.maxPoints,
            minPoints: props.minPoints
        })
    }
}

ReactDraw.propTypes = Object.assign({}, OLInteraction.propTypes, {
    drawend: PropTypes.func,
    drawstart: PropTypes.func,
    type: PropTypes.string.isRequired,
    maxPoints: PropTypes.number,
    minPoints: PropTypes.number
})

ReactDraw.olEvents = ["drawend", "drawstart"]

export default ReactDraw
