import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {LayerContext} from '../layer-context'
import {Draw} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLDraw extends OLInteraction {
    static contextType = LayerContext;
    static propTypes = {
	    ...OLInteraction.propTypes,
        condition: PropTypes.func,
        drawend: PropTypes.func,
        drawstart: PropTypes.func,
        type: PropTypes.string.isRequired,
        maxPoints: PropTypes.number,
        minPoints: PropTypes.number
    };
    static olEvents = ["drawend", "drawstart"];

    createInteraction() {
        const source = this.context.layer.getSource()
        //console.log("OLDraw.createInteraction", props.type)
        const interaction = new Draw({
            type: this.props.type,
            source: source,
            condition: this.props.condition,
            maxPoints: this.props.maxPoints,
            minPoints: this.props.minPoints
        })
/*
        interaction.addEventListener("drawend",
    	    (evt) => {
                if (this.props.drawend) {
                    console.log("Draw.drawend", evt);
                    this.props.drawend(evt);
                }
    	    }
    	);
        */
        return interaction;
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLDraw);
