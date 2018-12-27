import React from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Image as ImageLayer} from 'ol/layer'
import {BingMaps} from 'ol/source'
import OLLayer from './ol-layer'

export default class OLImage extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps();
        let sourceProps = this.buildSourceProps();
        let imageSource = null;

        switch (this.props.source) {
            case "BingMaps":
                imageSource = new BingMaps(sourceProps);
                break;
            default:
                throw "Unknown Image source:" + this.props.source;
            break
        }

        this.state.layer = new ImageLayer({
            ...layerProps,
            source: imageSource
        })
    }

    componentDidUpdate(prevProps) {
        console.log("OLImage.componentDidUpdate()", this.props);
        this.state.layer.setVisible(this.props.visible)
        this.state.layer.setZIndex(this.props.zIndex)
    }

    buildSourceProps() {
        console.log("layer.OLImage.buildSourceProps() FIXME")
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
