import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'ol/style';
import Tile from 'ol/layer/Tile';
import OLLayer from './ol-layer';
import {buildLayerProps, baseLayerPropTypes} from './';

class OLTile extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps(props);
        this.state.layer = new Tile({
            ...layerProps,
        })
    }

    componentWillReceiveProps(newProps) {
        this.state.layer.setVisible(newProps.visible)
        this.state.layer.setZIndex(newProps.zIndex)
    }
}

OLTile.propTypes = {
}

OLTile.defaultProps = {
  visible: true
}

export default OLTile
