import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {CollectionContext} from '../collection-context'
import {LayerProvider} from '../layer-context' // eslint-disable-line no-unused-vars
import Style from 'ol/style/Style'
import VectorLayer from 'ol/layer/Vector'

const Vector = (props) => {
    const layerCollection = useContext(CollectionContext);
    const [layer] = useState(new VectorLayer(props));

    useEffect(() => {
        layerCollection.push(layer);
        return () => {
            //layerCollection.pop();
        }
    }, []);

    useEffect(() => {
        layer.setOpacity((typeof props.opacity === "undefined")? 1.0 : props.opacity);
        //console.log("layer.Vector opacity set to", layer.getOpacity());
    }, [props.opacity]);

    useEffect(() => {
        layer.setVisible((typeof props.visible === "undefined")? true : props.visible);
        //console.log("layer.Vector visible set to", layer.getVisible());
    }, [props.visible]);

    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Vector.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,

    // These are for the layer switcher, if you use one.
    title: PropTypes.string.isRequired,
    baseLayer: PropTypes.bool,
    reordering: PropTypes.bool,
    permalink: PropTypes.string,

    opacity: PropTypes.number,
    visible: PropTypes.bool,
    zIndex: PropTypes.number,

    // There are no minZoom, maxZoom properties on layer type. :-(
    minResolution: PropTypes.number,
    maxResolution: PropTypes.number,
    extent: PropTypes.arrayOf(PropTypes.number),

    declutter: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Style)]),
};
export default Vector;
