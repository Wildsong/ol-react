import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Style} from 'ol/style';
import Tile from 'ol/layer/Tile';
import OLLayer from './OLLayer';
import {buildLayerProps, baseLayerPropTypes} from './';


class OLTile extends OLLayer {
    constructor(props) {
        super(props);

        let layerProps = this.buildLayerProps(props);

        this.layer = new Tile({
            ...layerProps,
        })
    }

    getChildContext() {
        return {
            layer: this.layer
        }
    }

    componentDidMount() {
        this.context.map.addLayer(this.layer)
    }

    componentWillReceiveProps(newProps) {
        this.layer.setVisible(newProps.visible)
        this.layer.setZIndex(newProps.zIndex)
    }

    componentWillUnmount() {
        this.context.map.removeLayer(this.layer)
    }
}

OLTile.propTypes = {
}

OLTile.defaultProps = {
  visible: true
}

OLTile.contextTypes = {
  map: PropTypes.instanceOf(Map)
}

OLTile.childContextTypes = {
  layer: PropTypes.instanceOf(Tile)
}

export default OLTile
