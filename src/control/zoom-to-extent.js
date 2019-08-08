import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {ZoomToExtent as olZoomToExtent} from 'ol/control';

const ZoomToExtent = (props) => {
	const map = useContext(MapContext);
	const [control] = useState(new olZoomToExtent(props));
	useEffect(() => {
		map.addControl(control);
		return () => { map.removeControl(control); }
	}, [control, map]);
	return null;
}
ZoomToExtent.propTypes = {
    className: PropTypes.string,
    extent: PropTypes.arrayOf(PropTypes.number),
    label: PropTypes.node,
    tipLabel: PropTypes.string
};
export default ZoomToExtent;
