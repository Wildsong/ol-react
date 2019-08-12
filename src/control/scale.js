import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import {MapContext} from '../map-context'
import olExtScale from 'ol-ext/control/Scale';

const Scale = (props) => {
   const map = useContext(MapContext);
   const [control] = useState(new olExtScale());
//   const setTarget = element => { control.setTarget(element); }

   useEffect(() => {
       map.addControl(control);
       return () => { map.removeControl(control); }
   }, []);

   return null;
}
export default Scale;
