import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'
import {Tile as TileLayer} from 'ol/layer'

const Tile = (props) => {
    const map = useContext(MapContext);
    const title = props.title;
    const [layer, layerState] = useState(new TileLayer({
        opacity: props.opacity,
        visible: props.visible
    }));
    console.log("layer.Tile", title);

    useEffect(() => {
        console.log("layer.Tile mounted", title);
        map.addLayer(layer);
        return () => {
            console.log("layer.Tile unmounted", title);
            map.removeLayer(layer);
        }
    }, [] );

    useEffect(() => {
        layer.setOpacity((typeof props.opacity === "undefined")? 1.0 : props.opacity);
        console.log("layer.Tile opacity set to", layer.getOpacity());
    }, [props.opacity]);

    useEffect(() => {
        layer.setVisible((typeof props.visible === "undefined")? true : props.visible);
        console.log("layer.Tile visible set to", layer.getVisible());
    }, [props.visible]);

    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Tile.propTypes =  {
    title: PropTypes.string.isRequired,
    opacity: PropTypes.number,
    visible: PropTypes.bool,
};
export default Tile;
