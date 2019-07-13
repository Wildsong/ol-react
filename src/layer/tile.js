import React from 'react'
import PropTypes from 'prop-types'
import {Map as olMap} from 'ol'
import {Tile as TileLayer} from 'ol/layer'

const Tile = (props) => {
    console.log("layer.Tile", props);
    //const layer = new TileLayer()
    //map.addLayer(layer);
}
Tile.propTypes =  {
    map: PropTypes.instanceOf(olMap)
};
export default Tile;
