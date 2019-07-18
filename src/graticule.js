import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Map, Graticule as olGraticule} from 'ol'
import {Stroke} from 'ol/style'
import {MapContext} from '../src/map-context'

const Graticule = (props) => {
    const map = useContext(MapContext);
    const [control, setControl] = useState(new olGraticule(props));
    useEffect(() => {
        map.addControl(control);
        return () => {
            map.removeControl(control);
        }
    }, []);
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
