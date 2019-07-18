import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {BingMaps as olBingMaps} from 'ol/source'

const BingMaps = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olBingMaps({
        ...props,
        key: props.apikey // key appears to be a reserved word
    }));
    useEffect(() => {
        console.log("source.BingMaps mounted");
        layer.setSource(source);
    }, []);
    return null; // Nothing needs to be rendered here.
}
BingMaps.propTypes = {
    imagerySet: PropTypes.string.isRequired, // "CanvasLight" | "Aerial" |...
    apikey: PropTypes.string.isRequired,  // Bing API key
    transition: PropTypes.number,      // time for opacity rendering transition feature
};
export default BingMaps;
