import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {Rotate} from 'ol/control';
import OLControl from './ol-control'

class OLRotate extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    	autoHide: PropTypes.bool,
    	className: PropTypes.string,
    	duration: PropTypes.number,
    	label: PropTypes.node,
    	resetNorth: PropTypes.func,
    	tipLabel: PropTypes.string
    }

    constructor(props) {
        super(props);
    	this.control = new Rotate({
    	    autoHide: props.autoHide,
    	    className: props.className,
    	    duration: props.duration,
    	    label: props.label,
    	    resetNorth: props.resetNorth,
    	    tipLabel: props.tipLabel
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLRotate);
