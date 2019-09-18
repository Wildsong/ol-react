import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {CollectionContext} from '../collection-context'
import {LayerProvider} from '../layer-context'  // eslint-disable-line no-unused-vars
import ImageLayer from 'ol/layer/Image'

const Image = (props) => {
    const layerCollection = useContext(CollectionContext);
    const [layer] = useState(new ImageLayer(props));

    useEffect(() => {
        layerCollection.push(layer);
        return () => {
            //layerCollection.pop();
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
    opaque: PropTypes.bool,
    projection: PropTypes.string,
    visible: PropTypes.bool,
    zIndex: PropTypes.number,
};
export default Image;
