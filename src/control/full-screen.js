import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FullScreen} from 'ol/control'
import OLControl from './ol-control'

class OLFullScreen extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    	className: PropTypes.string,
    	keys: PropTypes.bool,
    	label: PropTypes.node,
    	labelActive: PropTypes.node,
    	source: PropTypes.oneOfType([
    	    PropTypes.node,
    	    PropTypes.any
    	]),
    	tipLabel: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.control = new FullScreen({
    	    className: props.className,
    	    keys: props.keys,
    	    label: props.label,
    	    labelActive: props.labelActive,
    	    source: props.source,
    	    tipLabel: props.tipLabel
    	})
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLFullScreen);
