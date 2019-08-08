import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context' // eslint-disable-line no-unused-vars
import {Tile as TileLayer} from 'ol/layer'

const Tile = ({title, opacity, visible, children}) => {
    const map = useContext(MapContext);
    const [layer] = useState(new TileLayer({opacity, visible}));

    useEffect(() => {
        map.addLayer(layer);
        return () => {
            map.removeLayer(layer);
        }
    }, [layer, map, title] );

    useEffect(() => {
        layer.setOpacity((opacity === undefined)? 1.0 : opacity);
        //console.log("layer.Tile opacity set to", layer.getOpacity());
    }, [layer, opacity]);

    useEffect(() => {
        layer.setVisible((visible === undefined)? true : visible);
        //console.log("layer.Tile visible set to", layer.getVisible());
    }, [layer, visible]);

    return (
        <LayerProvider layer={layer}>
            {children}
        </LayerProvider>
    );
}
Tile.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
    title: PropTypes.string.isRequired,

    opacity: PropTypes.number,
    visible: PropTypes.bool,
};
export default Tile;
