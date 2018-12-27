import React from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Image as ImageLayer} from 'ol/layer'
import {ImageWMS} from 'ol/source'
import OLLayer from './ol-layer'

export default class OLImage extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps();
        let sourceProps = this.buildSourceProps();
        let imageSource = null;

        switch (this.props.source) {
            case "WMS":
                imageSource = new ImageWMS(sourceProps);
                break;

            default:
                throw "Unknown Image source:" + this.props.source;
            break
        }

        this.state.layer = new ImageLayer({
            ...layerProps,
            source: imageSource
        })
        console.log("layer.OLImage props=", sourceProps, imageSource, this.state);
    }

    componentDidUpdate(prevProps) {
        console.log("OLImage.componentDidUpdate()", this.props);
        this.state.layer.setVisible(this.props.visible)
        this.state.layer.setZIndex(this.props.zIndex)
    }

    buildSourceProps() {
        console.log("layer.OLImage.buildSourceProps() FIXME; don't copy everything")
        // but do copy:
        // params, projection, url
        return Object.assign({}, this.props);
    }
}

OLImage.propTypes = {
    source: PropTypes.string.isRequired,
    url: PropTypes.string,
    opacity: PropTypes.number,
    attributions: PropTypes.arrayOf(PropTypes.string)
}

OLImage.defaultProps = {
    visible: true
}
