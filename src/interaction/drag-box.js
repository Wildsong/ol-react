import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {LayerContext} from '../layer-context'
import {DragBox} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLDragBox extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    	boxdrag: PropTypes.func,
    	boxend: PropTypes.func,
    	boxstart: PropTypes.func,
    	condition: PropTypes.func
    };
    static olEvents = ["boxdrag", "boxend", "boxstart"]

    createInteraction() {
        console.log("dragbox.createInteraction", this.props);
    	const interaction = new DragBox({
    	    condition: this.props.condition
    	})

        //this.source = this.context.layer.getSource()

        return interaction;
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLDragBox);
