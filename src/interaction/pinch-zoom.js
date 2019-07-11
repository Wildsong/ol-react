import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {PinchZoom} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLPinchZoom extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
	    duration: PropTypes.number
    };

    createInteraction() {
    	return new PinchZoom({
    	    duration: this.props.duration
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLPinchZoom);
