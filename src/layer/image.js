import React from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Image as ImageLayer} from 'ol/layer'
import {ImageArcGISRest, ImageWMS} from 'ol/source'
import OLLayer from './ol-layer'

export default class OLImage extends OLLayer {
    static propTypes = {
    	source: PropTypes.string.isRequired,
    	url: PropTypes.string,
    	opacity: PropTypes.number,
    	attributions: PropTypes.arrayOf(PropTypes.string)
    }
    static defaultProps = {
	       visible: true
    }

    constructor(props) {
        super(props);

        this.dictLayer = [
            "extent",
            "minResolution",
            "maxResolution",
            "opacity",
            "opaque",
            "projection",
            "visible",
            "zIndex",
        ];

        // There are a few options here that are not supported by all image layer types
        this.dictSource = [
            'attributions',
            'attributionsCollapsible',
            'crossOrigin',
            'params',
            'projection',
            'ratio',
            'resolutions',
            'state',
            "url",
            'wrapX'
        ]

        let layerProps = this.buildProps(this.dictLayer);
        let sourceProps = {}
        let imageSource = null;

        switch (this.props.source) {
            case 'ArcGISRest':
                sourceProps = this.buildProps(this.dictSource);
                imageSource = new ImageArcGISRest(sourceProps);
                break;

            case "WMS":
                this.dictSource.push('serverType')
                sourceProps = this.buildProps(this.dictSource);
                imageSource = new ImageWMS(sourceProps);
                break;

            //case "Raster":
                // and a few others... add them please
                // http://openlayers.org/en/latest/apidoc/module-ol_source_Image-ImageSource.html

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
}
