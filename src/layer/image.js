import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'  // eslint-disable-line no-unused-vars
import {Image as olImageLayer} from 'ol/layer'

const Image = (props) => {
    const map = useContext(MapContext);
    const [layer] = useState(new olImageLayer(props));

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
Image.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,

    title: PropTypes.string.isRequired,
    baseLayer: PropTypes.bool,

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
