import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Image as ImageLayer} from 'ol/layer'
import {ImageArcGISRest, ImageWMS} from 'ol/source'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'

const Image = (props) => {
    const map = useContext(MapContext);
    console.log("layer.Image");
    const layer = new ImageLayer(props);
    map.addLayer(layer);
    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Image.propTypes =  {
    //children: PropTypes.object.isRequired,
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
