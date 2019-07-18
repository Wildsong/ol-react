import React, {useState, useContext, useEffect} from 'react'
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
    const [layer, layerState] = useState(new olVectorTileLayer({
        ...props,
        style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text)
    }));
    const title = props.title;
//    const style = buildStyle(props.style);
    console.log("layer.VectorTile", title);
    useEffect(() => {
        console.log("layer.VectorTile mounted", title);
        map.addLayer(layer);
        return () => {
            console.log("layer.VectorTile unmounted", title);
            map.removeLayer(layer);
        }
    }, []);

    useEffect(() => {
        layer.setOpacity((typeof props.opacity === "undefined")? 1.0 : props.opacity);
        console.log("layer.VectorTile opacity set to", layer.getOpacity());
    }, [props.opacity]);

    useEffect(() => {
        layer.setVisible((typeof props.visible === "undefined")? true : props.visible);
        console.log("layer.VectorTile visible set to", layer.getVisible());
    }, [props.visible]);

    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
VectorTile.propTypes = {
    title: PropTypes.string.isRequired,
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
