import React from 'react';
import PropTypes from 'prop-types';
import {ScaleLine} from 'ol/control';
import OLComponent from '../ol-component';
import {enumScaleLineUnits} from './scale-line-units'

class OLScaleLine extends OLComponent {
    static propTypes = {
    	className: PropTypes.string,
    	minWidth: PropTypes.number,
    	units: PropTypes.oneOf(enumScaleLineUnits)
    };

    constructor(props) {
        super(props);
        return new ScaleLine({
            className: props.className,
            minWidth: props.minWidth,
            units: props.units
        })
    }
}

export default OLScaleLine;
