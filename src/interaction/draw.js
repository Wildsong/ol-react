import React from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {Draw} from 'ol/interaction'
import OLInteraction from './ol-interaction'

export default class OLDraw extends OLInteraction {
    createInteraction (props) {
        let source = this.context.layer.getSource()
        console.log(source)
        let interaction = new Draw({
            type: props.type,
            maxPoints: props.maxPoints,
            minPoints: props.minPoints,
            source: source
        })
        interaction.addEventListener("drawend",
            (evt) => {
                console.log("OLDraw.drawend() event=",evt);
            }
        );
        console.log("Shiny new", this.context.layer, interaction);
        return interaction
    }
}
OLDraw.contextType = LayerContext

OLDraw.propTypes = Object.assign({}, OLInteraction.propTypes, {
    drawend: PropTypes.func,
    drawstart: PropTypes.func,
    type: PropTypes.string.isRequired,
    maxPoints: PropTypes.number,
    minPoints: PropTypes.number
})

// FIXME I think this is outdated and needs fixin'
OLDraw.olEvents = ["drawend", "drawstart"]
