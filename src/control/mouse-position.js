import React, {useState, useContext, useEffect} from 'react';    // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {Projection} from 'ol/proj'
import {toStringXY} from 'ol/coordinate'
import {MousePosition as olMousePosition} from 'ol/control'

const MousePosition = (props) => {
	const map = useContext(MapContext);
	const [control] = useState(new olMousePosition(props));
	const setTarget = element => {control.setTarget(element);}
	useEffect(() => {
		// default formatter has about 20 decimal places, looks stupid.
		if (control.getCoordinateFormat() === undefined) {
			control.setCoordinateFormat((coord) => {return toStringXY(coord, 4)});
		}
		map.addControl(control);
		//console.log("control.MousePosition mounted.", map.getControls().getLength());
		return () => {
			map.removeControl(control);
			//console.log("control.MousePosition unmounted", map.getControls().getLength());
		}
	}, []);
	return (
		<div ref={setTarget} className="ore-mouse-position"></div>
    );
}
MousePosition.propTypes = {
    className: PropTypes.string,
    coordinateFormat: PropTypes.func, // f(x) that takes coord and returns string
    projection: PropTypes.oneOfType([
        PropTypes.instanceOf(Projection),
        PropTypes.string
    ]),
    undefinedHTML: PropTypes.string, // Show this when mouse outside viewport
};
export default MousePosition;
