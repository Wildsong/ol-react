import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {ImageWMS as olImageWMS} from 'ol/source'
import {LayerContext} from '../layer-context'

const ImageWMS = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olImageWMS(props));

    useEffect(() => {
        console.log("source.WMS mounted");
        layer.setSource(source);
    }, [] );
    return null; // Nothing needs to be rendered here.
}
ImageWMS.propTypes =  {
    url: PropTypes.string,
    //attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.function,
    //    PropTypes.arrayOf(PropTypes.string)]),
    crossOrigin: PropTypes.string,
    params: PropTypes.string,
    projection: PropTypes.string,
    resolutions: PropTypes.arrayOf(PropTypes.number),
};
export default ImageWMS;
