import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'  // eslint-disable-line no-unused-vars
import {Image as olImageLayer} from 'ol/layer'

const Image = (props) => {
    const map = useContext(MapContext);
    const [layer] = useState(new olImageLayer(props));
    //console.log("layer.Image", title);

    useEffect(() => {
        //console.log("layer.Image mounted", title);
        map.addLayer(layer);
        return () => {
            //console.log("layer.Image unmounted", title);
            map.removeLayer(layer);
        }
    }, [layer, map]);

    useEffect(() => {
        layer.setOpacity((typeof props.opacity === "undefined")? 1.0 : props.opacity);
        //console.log("layer.Image opacity set to", layer.getOpacity());
    }, [layer, props.opacity]);

    useEffect(() => {
        layer.setVisible((typeof props.visible === "undefined")? true : props.visible);
        //console.log("layer.Image visible set to", layer.getVisible());
    }, [layer, props.visible]);

    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Image.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
    title: PropTypes.string.isRequired,
    extent: PropTypes.arrayOf(PropTypes.number),
    minResolution: PropTypes.number,
    maxResolution: PropTypes.number,
    opacity: PropTypes.number,
    opaque: PropTypes.bool,
    projection: PropTypes.string,
    visible: PropTypes.bool,
    zIndex: PropTypes.number,
};
export default Image;
