import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Tile as TileLayer} from 'ol/layer'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'

const Tile = (props) => {
    const map = useContext(MapContext);
    console.log("layer.Tile");
    const layer = new TileLayer({
        opacity: props.opacity
    })
    map.addLayer(layer);
    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Tile.propTypes =  {
    opacity: PropTypes.number,
};
export default Tile;
