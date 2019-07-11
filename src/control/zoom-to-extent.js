import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import OLPropTypes from '../ol-proptypes'
import {ZoomToExtent} from 'ol/control';
import OLControl from './ol-control'

class OLZoomToExtent extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    	className: PropTypes.string,
    	extent: PropTypes.arrayOf(PropTypes.number),
    	label: PropTypes.node,
    	tipLabel: PropTypes.string
    }

    constructor(props) {
	super(props);
        this.control = new ZoomToExtent({
            className: this.props.className,
            extent: this.props.extent,
            label: this.props.label,
            tipLabel: this.props.tipLabel
        })
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLZoomToExtent);
