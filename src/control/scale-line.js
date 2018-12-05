import React from 'react';
import PropTypes from 'prop-types';
import {ScaleLine} from 'ol/control';
import OLControl from './ol-control';
import {ScaleLineUnits} from './scale-line-units'

class OLScaleLine extends OLControl {
  createControl (props) {
    return new ScaleLine({
      className: props.className,
      minWidth: props.minWidth,
      units: props.units
    })
  }
}

ScaleLine.propTypes = Object.assign({}, OLControl.propTypes, {
  className: PropTypes.string,
  minWidth: PropTypes.number,
  units: PropTypes.oneOf(ScaleLineUnits)
})

export default OLScaleLine;
