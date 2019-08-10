import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {WMTS as olWMTS} from 'ol/source'

// I have not seen this code work yet.
// I was trying to use it in Example8, briefly.

const WMTS = (props) => {
    const layer = useContext(LayerContext);
    const [source] = useState(new olWMTS(props));

    useEffect(() => {
        layer.setSource(source);
    }, []);

    return null; // Nothing needs to be rendered here.
}
WMTS.propTypes =  {
    url: PropTypes.string,
    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
    layer: PropTypes.string,
    format: PropTypes.string, // "image/png" | "application/vnd.mapbox-vector-tile" | ...
    crossOrigin: PropTypes.string, // null | '' | 'anonymous'
    params: PropTypes.string,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default WMTS;
