import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Stamen as olStamen} from 'ol/source'
import {LayerContext} from '../layer-context'

const Stamen = (props) => {
    const layer = useContext(LayerContext);
    console.log("Stamen");
    const source = new olStamen(props);
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
export default Stamen;
