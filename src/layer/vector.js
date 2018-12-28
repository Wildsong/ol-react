import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import OLLayer from './ol-layer';
import {Collection} from 'ol';
import {buildLayerProps, baseLayerPropTypes} from './';
import {buildStyle} from '../style';

class OLVector extends OLLayer {
    constructor(props) {
        super(props);

        this.dictLayer.push('declutter');
        this.dictLayer.push('updateWhileAnimating');
        this.dictLayer.push('updateWhileInteracting');

        this.dictSource.push('format');
        //this.dictSource.push('features'); // gets created below
        // It's possible to use a custom loader function as an option.

        let layerProps = this.buildProps(this.dictLayer);
        let sourceProps = this.buildProps(this.dictSource);

        let vectorSource = new VectorSource(
            Object.assign({features: new Collection()}, sourceProps)
        );

        //console.log("layerProps", layerProps);
        this.state.layer = new VectorLayer({
            ...layerProps,
            style: buildStyle(this.props.style),
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
            source: vectorSource
        })
    }

    buildSourceProps() {
        console.log("FIXME build sourceProps here really", this.props);
        return Object.assign({}, this.props);
    }

/* I think the super class handles all of this???
    componentDidUpdate(prevProps) {
        console.log("layer.OLVector.componentDidUpdate()");
        super.componentDidUpdate(prevProps);
        // I think I need to see if style changed first...
        this.state.layer.setStyle(buildStyle(this.props.style));
    }
    */

    buildLayerProps() {
        // See http://openlayers.org/en/latest/apidoc/module-ol_source_TileImage-TileImage.html
        // I should probably have a separate dictionary for each layer type??
        let dictLayer = [
            "extent",
            "minResolution",
            "maxResolution",
            "opacity",
            "opaque",
            "projection",
            "visible",
            "url",
            "zIndex",
        ];
        return this.buildProps(dictLayer);
    }

    buildSourceProps() {
        let dictSource = [
        ];
        return this.buildProps(dictSource);
    }
}

OLVector.propTypes = {
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
    style: PropTypes.oneOfType([
            PropTypes.instanceOf(Style),
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.oneOfType([
                PropTypes.instanceOf(Style),
                PropTypes.object
            ]))
    ])
}

export default OLVector
