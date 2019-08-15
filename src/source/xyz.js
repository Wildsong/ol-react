import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import olXYZ from 'ol/source/XYZ'

const XYZ = (props) => {
    const layer = useContext(LayerContext);
    const [source] = useState(new olXYZ(props));

    useEffect(() => {
        layer.setSource(source);
    }, []);

    return null; // Nothing needs to be rendered here.
}
XYZ.propTypes = {
    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
    crossOrigin: PropTypes.string, // null | '' | 'anonymous'
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    url: PropTypes.string, // option 1: give me an URL as a string or function

    opaque: PropTypes.bool, // default = true I can't see any difference either way
    transition: PropTypes.number, // duration of opacity transition, 0=none
}
export default XYZ;
