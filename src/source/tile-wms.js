import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {TileWMS as olTileWMS} from 'ol/source'

const TileWMS = (props) => {
    const layer = useContext(LayerContext);
    const [source] = useState(new olTileWMS(props));
    useEffect(() => {
        console.log("source.TileWMS mounted");
        layer.setSource(source);
    }, []);
    return null; // Nothing needs to be rendered here.
}
TileWMS.propTypes =  {
    url: PropTypes.string,
    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
    crossOrigin: PropTypes.string, // null | '' | 'anonymous'
    params: PropTypes.object,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default TileWMS;
