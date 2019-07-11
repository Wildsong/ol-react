import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {PinchRotate} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLPinchRotate extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    	threshold: PropTypes.number,
    	duration: PropTypes.number
    };

    createInteraction() {
    	return new PinchRotate({
    	    threshold: this.props.threshold,
    	    duration: this.props.duration
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLPinchRotate);
