import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {Stamen as olStamen} from 'ol/source'

const Stamen = (props) => {
    const layer = useContext(LayerContext);
    const [source] = useState(new olStamen(props));
    useEffect(() => {
        //console.log("source.Stamen mounted");
        layer.setSource(source);
    }, []);
    return null; // Nothing needs to be rendered here.
}
Stamen.propTypes = {
    url: PropTypes.string,
    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
}
export default Stamen;
