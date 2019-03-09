import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { LayerContext } from '../layer-context'
import { Draw } from 'ol/interaction'
import OLInteraction from './ol-interaction'

export default class OLDraw extends OLInteraction {
    static contextType = LayerContext
    static propTypes = Object.assign({},
        OLInteraction.propTypes,
        {
        	drawend: PropTypes.func,
        	drawstart: PropTypes.func,
        	type: PropTypes.string.isRequired,
        	maxPoints: PropTypes.number,
        	minPoints: PropTypes.number
        }
    )

    static olEvents = ["drawend", "drawstart"]

    createInteraction(props) {
        let source = this.context.layer.getSource()
        //console.log("OLDraw.createInteraction", props.type)
        let interaction = new Draw({
            type: props.type,
            source: source,
            maxPoints: props.maxPoints,
            minPoints: props.minPoints
        })
        interaction.addEventListener("drawend",
    	    (evt) => {
                if (this.props.drawend) {
                    console.log("Draw.drawend", evt);
                    this.props.drawend(evt);
                }
    	    }
    	);
        return interaction
    }
}
