import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {XYZ as olXYZ} from 'ol/source'

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
}
export default XYZ;
