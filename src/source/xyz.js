import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {XYZ as olXYZ} from 'ol/source'

const XYZ = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olXYZ(props));
    useEffect(() => {
        console.log("source.XYZ mounted");
        layer.setSource(source);
    }, []);
    return null; // Nothing needs to be rendered here.
}
export default XYZ;
