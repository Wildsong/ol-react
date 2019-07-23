import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {ZoomToExtent as olZoomToExtent} from 'ol/control';

const ZoomToExtent = (props) => {
	const map = useContext(MapContext);
	const [control, setControl] = useState(new olZoomToExtent(props));
	useEffect(() => {
		map.addControl(control);
		return () => { map.removeControl(control); }
	}, []);
	return null;
}
ZoomToExtent.propTypes = {
    className: PropTypes.string,
    extent: PropTypes.arrayOf(PropTypes.number),
    label: PropTypes.node,
    tipLabel: PropTypes.string
};
export default ZoomToExtent;
