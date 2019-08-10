import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context' // eslint-disable-line no-unused-vars
import {Style as olStyle} from 'ol/style'
import {VectorTile as olVectorTileLayer} from 'ol/layer'

const VectorTile = (props) => {
    const map = useContext(MapContext);
    const [layer] = useState(new olVectorTileLayer(props));

    useEffect(() => {
        map.addLayer(layer);
        return () => {
            map.removeLayer(layer);
        }
    }, []);

    useEffect(() => {
        layer.setOpacity((typeof props.opacity === "undefined")? 1.0 : props.opacity);
    }, [props.opacity]);

    useEffect(() => {
        layer.setVisible((typeof props.visible === "undefined")? true : props.visible);
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
    baseLayer: PropTypes.bool,

    source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    layer: PropTypes.string,
    declutter: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(olStyle)]),
};
export default VectorTile;
