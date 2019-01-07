import React from 'react'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style } from 'ol/style'
import OLLayer from './ol-layer'
//import { Collection} from 'ol'
import { buildLayerProps, baseLayerPropTypes } from './'
import { buildStyle } from '../style'

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

        // THere used to be a feature collection added here
        // but it does not seem to matter at this time so I took it out
        this.state.source = new VectorSource(
//          Object.assign({features: new Collection()}, sourceProps)
            sourceProps
        );

        let style = buildStyle(this.props.style);

        //console.log("layerProps", layerProps);
        this.state.layer = new VectorLayer({
            ...layerProps,
            style: style,
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
            source: this.state.source
        })
    }

/* I think the super class handles all of this???
    componentDidUpdate(prevProps) {
        console.log("layer.OLVector.componentDidUpdate()");
        super.componentDidUpdate(prevProps);
        // I think I need to see if style changed first...
        this.state.layer.setStyle(buildStyle(this.props.style));
    }
    */
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
