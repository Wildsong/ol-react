import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {LayerContext} from '../layer-context'
import {Select} from 'ol/interaction'
import {Collection} from 'ol'
import OLInteraction from './ol-interaction'

class OLSelect extends OLInteraction {
    static contextType = LayerContext;
    static propTypes = {
         ...OLInteraction.propTypes,
	     condition: PropTypes.func,  // can be from ol/events/condition or custom
         select: PropTypes.func,     // handle select olEvents
         features: PropTypes.instanceOf(Collection),
         style: PropTypes.object
    };
    static olEvents = ["select"];

    createInteraction() {
        console.log("select.createInteraction", this.props);
    	const interaction = new Select({
            source: this.context.layer.getSource(),
    	    condition: this.props.condition,
            features: this.props.features,
            style: this.props.style
    	})
        return interaction;
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLSelect);
