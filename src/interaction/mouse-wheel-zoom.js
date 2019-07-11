import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {MouseWheelZoom} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLMouseWheelZoom extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    	duration: PropTypes.number,
    	useAnchor: PropTypes.bool
    };

    createInteraction() {
    	return new MouseWheelZoom({
    	    duration: this.props.duration,
    	    useAnchor: this.props.useAnchor
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLMouseWheelZoom);
