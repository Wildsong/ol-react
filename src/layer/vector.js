import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'ol/style';
import Vector from 'ol/layer/Vector';
import OLLayer from './ol-layer';
import {buildLayerProps, baseLayerPropTypes} from './';
import {buildStyle} from '../style';

class OLVector extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps(props);

        console.log("layerProps", layerProps);
        this.state.layer = new Vector({
            ...layerProps,
            style: buildStyle(props.style),
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
        })
    }

    componentWillReceiveProps(newProps) {
        super.componentWillReceiveProps(newProps);
        this.state.layer.setStyle(buildStyle(newProps.style));
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
