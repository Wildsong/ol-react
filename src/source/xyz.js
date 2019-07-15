import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {XYZ as olXYZ} from 'ol/source'
import {LayerContext} from '../layer-context'

const XYZ = (props) => {
    const layer = useContext(LayerContext);
    console.log("XYZ");
    const source = new olXYZ(props);
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
export default XYZ;
