import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {TileWMS as olTileWMS} from 'ol/source'
import {LayerContext} from '../layer-context'

const TileWMS = (props) => {
    const layer = useContext(LayerContext);
    console.log("TileWMS");
    const source = new olTileWMS(props);
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
TileWMS.propTypes =  {
    url: PropTypes.string,
    attributions: PropTypes.func,
    crossOrigin: PropTypes.string, // null | '' | 'anonymous'
    params: PropTypes.string,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default TileWMS;
