import React from 'react';
import PropTypes from 'prop-types';
import LayerContext from '../layer-context';
import {Style} from 'ol/style';
import Tile from 'ol/layer/Tile';
import OLLayer from './ol-layer';
import {buildLayerProps, baseLayerPropTypes} from './';

class OLTile extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps(props);
        this.layer = new Tile({
            ...layerProps,
        })
        LayerContext.layer = this.layer;
    }

    componentWillReceiveProps(newProps) {
        this.layer.setVisible(newProps.visible)
        this.layer.setZIndex(newProps.zIndex)
    }
}

OLTile.propTypes = {
}

OLTile.defaultProps = {
  visible: true
}

export default OLTile
