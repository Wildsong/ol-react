import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olScaleLine from 'ol/control/ScaleLine';
import {enumScaleLineUnits} from './scale-line-units'

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
ScaleLine.propTypes = {
    minWidth: PropTypes.number,
    units: PropTypes.oneOf(enumScaleLineUnits)
}
export default ScaleLine;
