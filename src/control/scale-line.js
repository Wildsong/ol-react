import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import {MapContext} from '../map-context'
import {ScaleLine as olScaleLine} from 'ol/control';
//import {enumScaleLineUnits} from './scale-line-units'

const ScaleLine = (props) => {
   const map = useContext(MapContext);
   const [control] = useState(new olScaleLine(props));
/*   const setTarget = element => {
       control.setTarget(element);
   }
*/
   useEffect(() => {
       map.addControl(control);
       return () => { map.removeControl(control); }
   }, []);
/*
   return (
       <div ref={setTarget}></div>
   );
   */
   return null;
}
export default ScaleLine;
