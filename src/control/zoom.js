import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Zoom} from 'ol/control'
import OLControl from './ol-control'

class OLZoom extends OLControl {
    static propTypes = {
    	className: PropTypes.string,
    	delta: PropTypes.number,
    	duration: PropTypes.number,
    	zoomInLabel: PropTypes.node,
    	zoomInTipLabel: PropTypes.string,
    	zoomOutLabel: PropTypes.node,
    	zoomOutTipLabel: PropTypes.string
    };
    static defaultProps = {
	    duration: 250
    }
    constructor(props) {
        super(props);
        this.control = new Zoom({
            className: props.className,
            delta: props.delta,
            duration: props.duration,
            zoomInLabel: props.zoomInLabel,
            zoomInTipLabel: props.zoomInTipLabel,
            zoomOutLabel: props.zoomOutLabel,
            zoomOutTipLabel: props.zoomOutTipLabel
        })
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLZoom);
