import React from 'react';
import PropTypes from 'prop-types';
import {DragBox as olDragBox} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragBox extends OLInteraction {
    static olEvents = ["boxdrag", "boxend", "boxstart"]

    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	boxdrag: PropTypes.func,
	boxend: PropTypes.func,
	boxstart: PropTypes.func,
	condition: PropTypes.func
    })

    createInteraction() {
	return new olDragBox({
	    condition: this.props.condition
	})
    }
}
