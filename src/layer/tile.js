import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Tile as TileLayer} from 'ol/layer'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'

const Tile = (props) => {
    const map = useContext(MapContext);
    let title;
    console.log("layer.Tile");
    const layer = new TileLayer({opacity: props.opacity})
    useEffect( () => {
        title = props.title;
        console.log("layer.Tile mounted", title);
        map.addLayer(layer);
        return () => {
            console.log("layer.Tile unmounted", title); 
            map.removeLayer(layer);
        }
    }, [] );
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
