import React from 'react'
import PropTypes from 'prop-types'
import {Map as olMap} from 'ol'
import {Tile as TileLayer} from 'ol/layer'

const layerContext = React.createContext();

const Tile = (props) => {
    console.log("layer.Tile", props);
    const layer = new TileLayer()
    props.map.addLayer(layer);
    return (
        <layerContext.Provider value={layer}>
        {props.children}
        </layerContext.Provider>
    );
}
Tile.propTypes =  {
    map: PropTypes.instanceOf(olMap),
    children: PropTypes.func.isRequired
};
export default Tile;
