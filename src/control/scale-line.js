import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {ScaleLine as olScaleLine} from 'ol/control';
import {enumScaleLineUnits} from './scale-line-units'
import {MapContext} from '../map-context'

const ScaleLine = (props) => {
   const map = useContext(MapContext);
   const control = new olScaleLine(props);
   const setTarget = element => {
       control.setTarget(element);
       map.addControl(control);
   }
   return (
       <div ref={setTarget}></div>
   );
}
export default ScaleLine;
