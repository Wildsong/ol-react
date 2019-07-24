import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'
import {Style as olStyle} from 'ol/style'
import {VectorTile as olVectorTileLayer} from 'ol/layer'

const VectorTile = (props) => {
    const map = useContext(MapContext);
    const [layer, layerState] = useState(new olVectorTileLayer(props));
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
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
    title: PropTypes.string.isRequired,

    source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    layer: PropTypes.string,
    declutter: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(olStyle)]),
};
export default VectorTile;
