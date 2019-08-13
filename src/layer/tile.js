import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context' // eslint-disable-line no-unused-vars
import TileLayer from 'ol/layer/Tile'

const Tile = (props) => {
    const map = useContext(MapContext);
    const [layer] = useState(new TileLayer(props));

    useEffect(() => {
        console.log("addLayer", props.title);
        map.addLayer(layer);
        return () => {
            console.log("removeLayer", props.title);
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

    // These are for the layer switcher, if you use one.
    title: PropTypes.string.isRequired,
    baseLayer: PropTypes.bool,
    reordering: PropTypes.bool,
    permalink: PropTypes.string,

    // There are no minZoom, maxZoom properties on layer type. :-(
    minResolution: PropTypes.number,
    maxResolution: PropTypes.number,
    extent: PropTypes.arrayOf(PropTypes.number),

    opacity: PropTypes.number,
    visible: PropTypes.bool,
};
export default Tile;
