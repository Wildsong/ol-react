import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Style as olStyle} from 'ol/style'
import {buildStyle} from '../style'
import {VectorTile as olVectorTileLayer} from 'ol/layer'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'
import {Fill, Icon, Stroke, Style, Text} from 'ol/style'
import {createMapboxStreetsV6Style} from '../mapbox-streets-v6-style'

const VectorTile = (props) => {
    const map = useContext(MapContext);
//    const style = buildStyle(props.style);
    const options = {
        ...props,
        style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text)
    }
    console.log("layer.VectorTile", options);
    const layer = new olVectorTileLayer(options)
    map.addLayer(layer);
    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
VectorTile.propTypes = {
    source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    layer: PropTypes.string,
    declutter: PropTypes.bool,

    //style mapbox style...
/*    this.dictLayer = [
        "opacity",
        "visible",
        "extent",
        "zIndex",
        "minResolution",
        "maxResolution",
        'preload',
        'map',
        'style'
*/
};
export default VectorTile;
