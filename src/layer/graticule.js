import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import olGraticule from 'ol/layer/Graticule'
import {MapContext} from '../map-context'

const Graticule = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olGraticule(props));

    useEffect(() => {
        map.addControl(control);
        return () => {
            map.removeControl(control);
        }
    }, [map, control]);

    return null;
}
Graticule.propTypes = {
    maxLines: PropTypes.number,
    stroke: PropTypes.string,
    targetSize: PropTypes.number,
    showLabels: PropTypes.bool,
    lonLabelFormatter: PropTypes.func,
    latLabelFormatter: PropTypes.func,
    lonLabelPosition: PropTypes.number,
    latLabelPosition: PropTypes.number,
    intervals: PropTypes.arrayOf(PropTypes.number)
}
export default Graticule;
