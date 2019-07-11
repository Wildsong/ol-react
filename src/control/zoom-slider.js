import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {ZoomSlider} from 'ol/control';
import OLControl from './ol-control'

class OLZoomSlider extends OLControl {
    static propTypes = {
    	className: PropTypes.string,
    	duration: PropTypes.number,
    	maxResolution: PropTypes.number,
    	minResolution: PropTypes.number
    }

    constructor(props) {
    	this.control = new ZoomSlider({
    	    className: props.className,
    	    duration: props.duration,
    	    maxResolution: props.maxResolution,
    	    minResolution: props.duration
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLZoomSlider);
