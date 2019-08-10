import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context' // eslint-disable-line no-unused-vars
import {Tile as TileLayer} from 'ol/layer'

const Tile = (props) => {
    const map = useContext(MapContext);
    const [layer] = useState(new TileLayer(props));

    useEffect(() => {
        map.addLayer(layer);
        return () => {
            map.removeLayer(layer);
        }
    }, []);

    useEffect(() => {
        layer.setOpacity((props.opacity === undefined)? 1.0 : props.opacity);
    }, [props.opacity]);

    useEffect(() => {
        layer.setVisible((props.visible === undefined)? true : props.visible);
    }, [props.visible]);

    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Tile.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,

    title: PropTypes.string.isRequired,
    baseLayer: PropTypes.bool,

    opacity: PropTypes.number,
    visible: PropTypes.bool,
};
export default Tile;
