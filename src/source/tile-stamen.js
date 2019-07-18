import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {Stamen as olStamen} from 'ol/source'

const Stamen = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olStamen(props));
    useEffect(() => {
        console.log("source.Stamen mounted");
        layer.setSource(source);
    }, []);
    return null; // Nothing needs to be rendered here.
}
export default Stamen;
