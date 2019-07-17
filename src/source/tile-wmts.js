import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {WMTS as olWMTS} from 'ol/source'
import {LayerContext} from '../layer-context'

// I have not seen this code work yet.
// I was trying to use it in Example8, briefly.

const WMTS = (props) => {
    const layer = useContext(LayerContext);
    console.log("WMTS");
    const source = new olWMTS(props);
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
WMTS.propTypes =  {
    url: PropTypes.string,
    attributions: PropTypes.string,
    layer: PropTypes.string,
    format: PropTypes.string, // "image/png" | "application/vnd.mapbox-vector-tile" | ...
    crossOrigin: PropTypes.string, // null | '' | 'anonymous'
    params: PropTypes.string,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default WMTS;
