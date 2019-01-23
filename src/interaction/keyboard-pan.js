import React from 'react';
import PropTypes from 'prop-types';
import {KeyboardPan as olKeyboardPan} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class KeyboardPan extends OLInteraction {
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	condition: PropTypes.func,
	duration: PropTypes.number,
	pixelDelta: PropTypes.number
    })

    createInteraction (props) {
        return new olKeyboardPan({
            condition: props.condition,
            duration: props.duration,
            pixelDelta: props.pixelDelta
        })
    }
}

