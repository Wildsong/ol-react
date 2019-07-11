import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {DragZoom} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLDragZoom extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    	boxdrag: PropTypes.func,
    	boxend: PropTypes.func,
    	boxstart: PropTypes.func,
    	condition: PropTypes.func,
    	duration: PropTypes.number,
    	out: PropTypes.bool
    };
    static olEvents = ["boxdrag", "boxend", "boxstart"]
    createInteraction() {
    	return new DragZoom({
    	    condition: this.props.condition,
    	    duration: this.props.duration,
    	    out: this.props.out
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLDragZoom);
