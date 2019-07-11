import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {KeyboardZoom} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLKeyboardZoom extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    	condition: PropTypes.func,
    	delta: PropTypes.number,
    	duration: PropTypes.number
    };

    createInteraction() {
    	return new KeyboardZoom({
    	    condition: this.props.condition,
    	    delta: this.props.delta,
    	    duration: this.props.duration
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLKeyboardZoom);
