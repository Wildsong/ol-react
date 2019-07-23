import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {zoom as olZoom} from 'ol/control';

const Zoom = (props) => {
	const map = useContext(MapContext);
	const [control, setControl] = useState(new olZoom(props));
	useEffect(() => {
		map.addControl(control);
		return () => { map.removeControl(control); }
	}, []);
	return null;
}
Zoom.propTypes = {
    className: PropTypes.string,
    extent: PropTypes.arrayOf(PropTypes.number),
    label: PropTypes.node,
    tipLabel: PropTypes.string
};
export default Zoom;
