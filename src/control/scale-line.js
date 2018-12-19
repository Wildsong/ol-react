import React from 'react';
import PropTypes from 'prop-types';
import {ScaleLine} from 'ol/control';
import OLControl from './ol-control';
import {enumScaleLineUnits} from './scale-line-units'

export default class OLScaleLine extends OLControl {

    createControl (props) {
        return new ScaleLine({
            className: props.className,
            minWidth: props.minWidth,
            units: props.units
        })
    }
}

OLScaleLine.propTypes = Object.assign({}, OLControl.propTypes, {
    className: PropTypes.string,
    minWidth: PropTypes.number,
    units: PropTypes.oneOf(enumScaleLineUnits)
})
