import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {ImageArcGISRest as olImageArcGISRest} from 'ol/source'
import {LayerContext} from '../layer-context'

const ImageArcGISRest = (props) => {
    const layer = useContext(LayerContext);
    console.log("ImageArcGISRest");
    const source = new olImageArcGISRest(props);
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
ImageArcGISRest.propTypes =  {
    url: PropTypes.string,
    attributions: PropTypes.func,
    crossOrigin: PropTypes.string,
    params: PropTypes.string,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default ImageArcGISRest;
