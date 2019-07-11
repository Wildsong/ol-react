import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {ScaleLine} from 'ol/control';
import OLControl from './ol-control'
import {enumScaleLineUnits} from './scale-line-units'

class OLScaleLine extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    	className: PropTypes.string,
    	minWidth: PropTypes.number,
    	units: PropTypes.oneOf(enumScaleLineUnits)
    };

    constructor(props) {
        super(props);
        this.control = new ScaleLine({
            className: props.className,
            minWidth: props.minWidth,
            units: props.units
        })
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLScaleLine);
