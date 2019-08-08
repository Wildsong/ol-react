import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {OSM as olOSM} from 'ol/source'

const OSM = () => {
    const layer = useContext(LayerContext)
    const [source] = useState(new olOSM());
    useEffect(() => {
        //console.log("source.OSM mounted");
        layer.setSource(source);
    }, []);
    return null; // Nothing needs to be rendered here.
}
OSM.propTypes = {
    url: PropTypes.string,
    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
}
export default OSM;
