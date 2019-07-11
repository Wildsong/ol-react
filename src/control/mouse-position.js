import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {MousePosition} from 'ol/control';
import {Projection} from 'ol/proj';
import OLControl from './ol-control'

// FIXME
// I'd like to have "target" here but think the right way
// is to not use the mouseposition control
// there should be a React component that renders instead
// so I need to catch the mouse event instead of using
// this OL control
// Hence this control just throws the coord onto the map for now
const OLMousePosition = ({map, className, coordinateFormat, projection, undefinedHTML}) => {
	const control = new MousePosition({
	    className: className,
	    coordinateFormat: coordinateFormat,
	    projection: projection,
	    undefinedHTML: undefinedHTML,
	});
    map.addControl(control);
    return null;
}
OLMousePosition.propTypes = {
    ...OLControl.propTypes,
    className: PropTypes.string,
    coordinateFormat: PropTypes.func, // f(x) that takes coord and returns string
    projection: PropTypes.oneOfType([
        PropTypes.instanceOf(Projection),
        PropTypes.string
    ]),
    undefinedHTML: PropTypes.string, // Show this when mouse outside viewport
    // See also ol-control for more!
};
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLMousePosition);
