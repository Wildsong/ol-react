import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {ImageWMS as olImageWMS} from 'ol/source'
import {LayerContext} from '../layer-context'

const ImageWMS = (props) => {
    const layer = useContext(LayerContext);
    console.log("ImageWMS");
    const source = new olImageWMS(props);
    layer.setSource(source)
    return null; // Nothing needs to be rendered here.
}
ImageWMS.propTypes =  {
    url: PropTypes.string,
    attributions: PropTypes.func,
    crossOrigin: PropTypes.string,
    params: PropTypes.string,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default ImageWMS;
