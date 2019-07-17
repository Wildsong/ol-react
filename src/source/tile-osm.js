import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {OSM as olOSM} from 'ol/source'
import {LayerContext} from '../layer-context'

const OSM = () => {
    const layer = useContext(LayerContext);
    console.log("source.OSM");
    const source = new olOSM();
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
export default OSM;
