import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {DoubleClickZoom} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLDoubleClickZoom extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
        delta: PropTypes.number,
        duration: PropTypes.number
    };

    createInteraction(props) {
    	this.interaction = new DoubleClickZoom({
    	    delta: props.delta,
    	    duration: props.duration
    	})
        return this.interaction;
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLDoubleClickZoom);
