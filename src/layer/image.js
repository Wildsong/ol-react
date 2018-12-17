import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'ol/style';
import {Image} from 'ol/layer';
import OLLayer from './ol-layer';

class OLImage extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps(props);
        this.state.layer = new Image({
            ...layerProps,
        })
    }

    componentWillReceiveProps(newProps) {
        this.state.layer.setVisible(newProps.visible)
        this.state.layer.setZIndex(newProps.zIndex)
    }
}

OLImage.propTypes = {
}

OLImage.defaultProps = {
    visible: true
}

export default OLImage
