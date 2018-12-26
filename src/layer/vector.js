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
        let layerProps = this.buildLayerProps();
        let sourceProps = this.buildSourceProps();

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
        console.log("No really build sourceProps here really", this.props);
        return Object.assign({}, this.props);
    }

    componentDidUpdate(prevProps) {
        console.log("layer.OLVector.componentDidUpdate()");
        super.componentDidUpdate(prevProps);

        // I think I need to see if style changed first...
        this.state.layer.setStyle(buildStyle(this.props.style));
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
