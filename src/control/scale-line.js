import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types';
import {MapContext} from '../map-context'
import {ScaleLine as olScaleLine} from 'ol/control';
import {enumScaleLineUnits} from './scale-line-units'

const ScaleLine = (props) => {
   const map = useContext(MapContext);
   const [control, setControl] = useState(new olScaleLine(props));
   const setTarget = element => {
       control.setTarget(element);
   }
   useEffect(() => {
       map.addControl(control);
       return () => { map.removeControl(control); }
   }, []);
   return (
       <div ref={setTarget}></div>
   );
}
export default ScaleLine;
