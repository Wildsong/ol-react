import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {MousePosition as olMousePosition} from 'ol/control'
import {Projection} from 'ol/proj'
import {MapContext} from '../map-context'

const MousePosition = (props) => {
	const map = useContext(MapContext);
	const control = new olMousePosition(props);
	const setTarget = element => {
		control.setTarget(element);
		map.addControl(control);
	}
	return (
		<div ref={setTarget}></div>
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
