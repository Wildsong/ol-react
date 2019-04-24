import React from 'react';
import PropTypes from 'prop-types';
import { LayerContext } from '../layer-context'
import { DragBox as olDragBox } from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragBox extends OLInteraction {
    static olEvents = ["boxdrag", "boxend", "boxstart"]

    static propTypes = Object.assign({}, OLInteraction.propTypes, {
    	boxdrag: PropTypes.func,
    	boxend: PropTypes.func,
    	boxstart: PropTypes.func,
    	condition: PropTypes.func,
    })

    createInteraction() {
        console.log("dragbox.createInteraction", this.props);
    	const interaction = new olDragBox({
    	    condition: this.props.condition
    	})

        //this.source = this.context.layer.getSource()

        return interaction;
    }
}
