import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'ol/style';
import {Image} from 'ol/layer';
import OLLayer from './ol-layer';

class OLImage extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps(props);
        this.layer = new Image({
            ...layerProps,
        })
    }

    componentWillReceiveProps(newProps) {
        this.layer.setVisible(newProps.visible)
        this.layer.setZIndex(newProps.zIndex)
    }
}

OLImage.propTypes = {
}

OLImage.defaultProps = {
    visible: true
}

OLImage.contextTypes = {
    map: PropTypes.instanceOf(Map)
}

export default OLImage
