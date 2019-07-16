import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Style as olStyle} from 'ol/style'
import {buildStyle} from '../style'
import {VectorTile as olVectorTileLayer} from 'ol/layer'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'

const VectorTile = (props) => {
    const map = useContext(MapContext);
    console.log("layer.VectorTile", props);
    const style = buildStyle(props.style);
    const layer = new olVectorTileLayer({
        ...props,
        style
    })
    map.addLayer(layer);
    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
/*
VectorTile.propTypes = {
    source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    attributions: PropTypes.arrayOf(PropTypes.string),
    layer: PropTypes.string,
    this.dictLayer = [
        "opacity",
        "visible",
        "extent",
        "zIndex",
        "minResolution",
        "maxResolution",
        'preload',
        'map',
        'style'
};
*/
export default VectorTile;
